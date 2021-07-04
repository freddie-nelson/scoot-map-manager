<template>
  <s-dashboard-card>
    <s-home-dash-title>Featured Maps</s-home-dash-title>

    <s-map-list class="mt-3" :maps="maps" />
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

export default defineComponent({
  name: "SHomeDashFeatured",
  components: {
    SDashboardCard,
    SHomeDashTitle,
    SMapList,
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

      console.log(mapNames);

      const arr: (Map | false)[] = await Promise.all(
        mapNames.map(async (n) => {
          const docRef = doc(db, "maps", n);

          let d: DocumentData | undefined;
          try {
            let res = await getDocFromCache(docRef);
            if (!res.exists()) {
              res = await getDoc(docRef);
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

    return {
      maps,
      isLoading,

      isDownloading,
      downloadMap,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>