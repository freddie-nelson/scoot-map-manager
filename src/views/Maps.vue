<template>
  <main class="overflow-y-scroll relative">
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

    <div v-if="isLoading">
      <s-gradient-heading class="text-center mt-32" :size="5">
        Loading Maps...
      </s-gradient-heading>
      <s-spinner-bar class="h-5 mt-10 w-full max-w-2xl px-8 mx-auto" />
    </div>

    <div v-else>
      <s-map-list
        v-if="maps.length > 0"
        :maps="maps"
        @map-clicked="downloadMap(maps[$event])"
      />
      <h1 v-else class="font-semibold text-2xl text-center py-10 opacity-60">
        You've reached the end, how about adding your own map?
      </h1>

      <div class="mt-10 flex justify-center">
        <s-button @click="previousPage" class="py-1.5 w-10 h-full text-4xl">
          &#8249;
        </s-button>

        <s-button class="py-3 w-10 h-full mx-3 text-xl">
          {{ pageNum }}
        </s-button>

        <s-button @click="nextPage" class="py-1.5 w-10 h-full text-4xl">
          &#8250;
        </s-button>
      </div>
    </div>

    <!-- download modal -->
    <div
      v-if="isDownloading"
      class="
        absolute
        top-0
        left-0
        w-full
        h-full
        flex
        justify-center
        items-center
        bg-bg-dark bg-opacity-70
      "
    >
      <div
        class="
          flex flex-col
          justify-center
          items-center
          max-w-2xl
          w-full
          p-12
          rounded-lg
          bg-input-focus
        "
      >
        <s-gradient-heading class="mb-5" :size="4" noScale>
          Downloading Map...
        </s-gradient-heading>
        <s-spinner-bar class="h-4 w-full" />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Map, useStore } from "@/store";
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
  endBefore,
  endAt,
  increment,
  doc,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";
import { createDir, writeBinaryFile } from "@tauri-apps/api/fs";
import { buildInputFile, Call } from "wasm-imagemagick";

export default defineComponent({
  name: "Maps",
  components: {
    SGradientHeading,
    SInputText,
    SMapList,
    SButton,
    SSpinnerBar,
  },
  setup() {
    const store = useStore();

    const db = getFirestore();
    const mapsRef = collection(db, "maps");
    const pageNum = ref(0);
    const perPage = ref(25);

    const maps = ref<Map[]>([]);
    const isLoading = ref(false);

    const addDocsToMaps = (docs: DocumentData[]) => {
      maps.value = [];

      docs.forEach((doc) => {
        const data = doc.data();

        const map: Map = {
          name: data.name,
          creator: data.creator,
          image: data.image,
          imageEscaped: data.image.replace(/'|"|`|\(|\)|\[|\]/g, "\\$&"),
          parkFile: data.parkFile,
          downloads: data.downloads || 0,
        };

        maps.value.push(map);
      });
    };

    let firstVisible: DocumentData;
    let lastVisible: DocumentData;

    const setDocBoundaries = (docs: DocumentData[]) => {
      if (docs.length === 0) return;

      firstVisible = docs[0];
      lastVisible = docs[docs.length - 1];
    };

    const fetchNextMaps = async () => {
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

      setDocBoundaries(docs.docs);
      addDocsToMaps(docs.docs);
    };

    const fetchPreviousMaps = async () => {
      let q: Query<DocumentData>;
      if (maps.value.length === 0) {
        q = query(
          mapsRef,
          orderBy("created_at", "desc"),
          endAt(lastVisible),
          limit(perPage.value)
        );
      } else {
        q = query(
          mapsRef,
          orderBy("created_at", "desc"),
          endBefore(firstVisible),
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

      setDocBoundaries(docs.docs);
      addDocsToMaps(docs.docs);
    };

    const nextPage = async () => {
      if (maps.value.length === 0 && pageNum.value !== 0) return;

      pageNum.value++;
      isLoading.value = true;

      await fetchNextMaps();

      isLoading.value = false;
    };

    const previousPage = async () => {
      if (pageNum.value === 1) return;

      pageNum.value--;
      isLoading.value = true;

      await fetchPreviousMaps();

      isLoading.value = false;
    };

    onBeforeMount(nextPage);

    const fetchAndSaveMap = async (map: Map) => {
      let image: ArrayBuffer;
      try {
        const outputFiles = await Call(
          [await buildInputFile(map.image, "image.jpg")],
          ["convert", "image.jpg", "-resize", "1200x1200", "image.png"]
        );

        if (!outputFiles[0]) throw new Error("Failed to convert image to png.");

        image = await outputFiles[0].blob.arrayBuffer();
      } catch (error) {
        console.log(error);
        return;
      }

      let parkFile: ArrayBuffer;
      try {
        parkFile = await fetch(map.parkFile).then((res) => res.arrayBuffer());
      } catch (error) {
        console.log(error);
        return;
      }

      const mapDir = `${store.state.mapsDir.dir}/${map.name}`;

      try {
        await createDir(mapDir, { recursive: true });
        await writeBinaryFile({
          contents: image,
          path: `${mapDir}/ParkCapture.png`,
        });
        await writeBinaryFile({
          contents: parkFile,
          path: `${mapDir}/ObjectInfo.ScootPark`,
        });
      } catch (error) {
        console.log(error);
        return;
      }

      console.log("saved map");
    };

    const incrementDownloadsCounter = async (map: Map) => {
      // get map doc reference
      let mapRef: DocumentReference<DocumentData>;
      try {
        mapRef = await doc(db, "maps", map.name);
      } catch (error) {
        console.log(error);
        return;
      }

      // update downloads
      try {
        await updateDoc(mapRef, {
          downloads: increment(1),
        });
      } catch (error) {
        console.log(error);
        return;
      }
    };

    const isDownloading = ref(false);
    const downloadMap = async (map: Map) => {
      isDownloading.value = true;

      await fetchAndSaveMap(map);
      await incrementDownloadsCounter(map);

      isDownloading.value = false;
    };

    const searchTerm = ref("");
    const search = () => {
      console.log(searchTerm.value);
    };

    return {
      pageNum,
      maps,
      isLoading,
      nextPage,
      previousPage,
      isDownloading,
      downloadMap,
      searchTerm,
      search,
    };
  },
});
</script>

<style lang="scss" scoped></style>
