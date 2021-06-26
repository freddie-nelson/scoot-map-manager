<template>
  <main class="overflow-y-scroll">
    <header class="mb-11 flex justify-between items-center">
      <s-gradient-heading :size="4">Global Maps</s-gradient-heading>

      <div class="flex">
        <s-input-text
          class="w-96"
          v-model="searchTerm"
          name="search"
          placeholder="Search..."
          @keyup.enter="search"
        />
        <s-button class="ml-2.5 py-3 h-full" @click="search">Search</s-button>
      </div>
    </header>

    <s-gradient-heading class="text-center mt-28" :size="6" v-if="isLoading">
      Loading Maps...
    </s-gradient-heading>
    <s-map-list v-else :maps="maps" @map-clicked="installMap(maps[i])" />
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Map } from "@/store";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QuerySnapshot,
  DocumentData,
  Query,
} from "firebase/firestore";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "Maps",
  components: {
    SGradientHeading,
    SInputText,
    SMapList,
    SButton,
  },
  setup() {
    const db = getFirestore();
    const mapsRef = collection(db, "maps");
    const perPage = ref(25);
    let lastVisible: DocumentData;

    const maps = ref<Map[]>([]);
    const isLoading = ref(false);

    const fetchMaps = async () => {
      let q: Query<DocumentData>;
      if (!lastVisible) {
        q = query(mapsRef, orderBy("created_at", "desc"), limit(perPage.value));
      } else {
        q = query(
          mapsRef,
          orderBy("created_at", "desc"),
          startAfter(lastVisible),
          limit(perPage.value)
        );
      }

      let docs: QuerySnapshot<DocumentData>;
      try {
        docs = await getDocs(q);
      } catch (error) {
        console.log(error);
        return;
      }

      lastVisible = docs.docs[docs.docs.length - 1];

      docs.docs.forEach((doc) => {
        const data = doc.data();

        const map: Map = {
          name: data.name,
          creator: data.creator,
          image: data.image,
          parkFile: data.parkFile,
          downloads: data.downloads || 0,
        };

        maps.value.push(map);
      });
    };

    onBeforeMount(async () => {
      isLoading.value = true;
      await fetchMaps();
      isLoading.value = false;
    });

    const installMap = (map: Map) => {
      console.log(map);
    };

    const searchTerm = ref("");
    const search = () => {
      console.log(searchTerm.value);
    };

    return {
      maps,
      isLoading,
      installMap,
      searchTerm,
      search,
    };
  },
});
</script>

<style lang="scss" scoped></style>
