<template>
  <s-dashboard-card class="flex flex-col">
    <s-home-dash-title>Featured Maps</s-home-dash-title>

    <div v-if="isLoading" class="m-auto flex flex-col items-center w-full">
      <s-gradient-heading :size="5"> Loading Maps... </s-gradient-heading>
      <s-spinner-bar class="h-5 mt-4 w-full max-w-2xl px-8 mx-auto" />
    </div>

    <s-map-list
      v-else-if="maps.length > 0"
      class="map-list mt-3"
      :maps="maps"
      @map-clicked="downloadMap(maps[$event])"
    />

    <h1 v-else class="m-auto text-center text-3xl font-semibold opacity-60">
      No featured maps right now, check back later.
    </h1>

    <s-modals-download v-if="isDownloading" />
  </s-dashboard-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import useUserMaps from "@/hooks/useUserMaps";
import { Map } from "@/store";

import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocFromCache,
  getDocs,
  getFirestore,
  query,
} from "@firebase/firestore";

import SDashboardCard from "@/components/app/Dashboard/SDashboardCard.vue";
import SHomeDashTitle from "./SHomeDashTitle.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SModalsDownload from "@/components/app/Modals/SModalsDownload.vue";
import { onBeforeRouteLeave } from "vue-router";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "SHomeDashFeatured",
  components: {
    SDashboardCard,
    SHomeDashTitle,
    SMapList,
    SModalsDownload,
    SGradientHeading,
    SSpinnerBar,
  },
  setup() {
    const db = getFirestore();
    const featuredMapsRef = collection(db, "featuredMaps");
    const q = query(featuredMapsRef);

    const maps = ref<Map[]>([]);
    const isLoading = ref(false);

    const { downloadMap, isDownloading } = useUserMaps(maps);

    const fetchFeaturedMaps = async () => {
      isLoading.value = true;

      // get names of featured maps
      let mapNames: string[] = [];
      try {
        const docs = await getDocs(q);
        if (docs.empty) throw new Error("No featured maps.");

        mapNames = docs.docs.map((d) => d.id);
      } catch (error) {
        console.log(error);
        isLoading.value = false;
        return;
      }

      const arr: (Map | false)[] = await Promise.all(
        mapNames.map(async (n) => {
          const docRef = doc(db, "maps", n);

          let d: DocumentData | undefined;
          try {
            let res = await getDocFromCache(docRef);
            if (!res.exists()) {
              res = await getDoc(docRef);
            } else {
              console.log("featured map in cache");
            }

            d = await res.data();
            if (!d) return false;
          } catch (error) {
            console.log(error);
            return false;
          }

          return {
            name: d.name,
            creator: d.creator,
            image: d.image,
            parkFile: d.parkFile,
            downloads: d.downloads,
          };
        })
      );

      if (arr.includes(false)) return (isLoading.value = false);

      maps.value = arr as Map[];

      isLoading.value = false;
    };

    onMounted(fetchFeaturedMaps);

    onBeforeRouteLeave(() => {
      if (isDownloading.value) return false;
    });

    return {
      maps,
      isLoading,

      isDownloading,
      downloadMap,
    };
  },
});
</script>

<style lang="scss">
.map-list {
  flex-grow: 1;
  grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr)) !important;

  > * {
    height: 100% !important;
  }
}
</style>