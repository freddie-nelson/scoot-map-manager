<template>
  <main class="overflow-y-scroll">
    <header class="mb-11 flex justify-between items-center">
      <s-gradient-heading :size="4">Installed Maps</s-gradient-heading>

      <div>
        <s-button
          @click="$router.push({ name: 'Setup' })"
          class="transform scale-90"
          >Locate Folder
        </s-button>
        <s-button @click="loadMaps(true)" class="ml-5 transform scale-90"
          >Refresh Maps
        </s-button>
      </div>
    </header>

    <s-gradient-heading class="text-center mt-28" :size="6" v-if="isLoading">
      Loading Maps...
    </s-gradient-heading>
    <s-map-list
      v-else
      :maps="$store.state.installedMaps"
      :buttonIcon="icons.trash"
      @map-clicked="deleteMap"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { useStore } from "@/store";
import {
  FileEntry,
  readDir,
  removeDir,
  readBinaryFile,
} from "@tauri-apps/api/fs";
import pathParse from "path-parse";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";

import trashIcon from "@iconify-icons/feather/trash";

export default defineComponent({
  name: "Installed",
  components: {
    SGradientHeading,
    SMapList,
    SButton,
  },
  setup() {
    const store = useStore();
    const mapsDir = `${store.state.mapsDir.dir}/`;

    const isLoading = ref(false);

    const readAndParseMaps = async () => {
      let folders: FileEntry[];
      try {
        folders = await readDir(mapsDir);
      } catch (error) {
        return;
      }

      store.commit("SET_INSTALLED_MAPS", []);

      let i = 0;
      for (const folder of folders) {
        i++;
        if (!folder.children) return;

        // find map files
        const files = await readDir(folder.path);

        const parkFile = files.find((f) => f.name === "ObjectInfo.ScootPark");
        if (!parkFile) return;

        const previewImage = files.find((f) => f.name === "ParkCapture.png");
        if (!previewImage) return;

        // read image as binary
        let byteArr: Uint8Array;

        try {
          byteArr = new Uint8Array(await readBinaryFile(previewImage.path));
        } catch (error) {
          return;
        }

        const blob = new Blob([byteArr], { type: "image/png" });

        // add map to maps
        store.commit("ADD_INSTALLED_MAP", {
          name: folder.name || `Map ${i}`,
          creator: "You",
          image: URL.createObjectURL(blob),
          parkFile: parkFile.path,
        });
      }
    };

    const loadMaps = async (force?: boolean) => {
      if (!force && Date.now() - store.state.lastLoadedMaps < 300000) return;

      isLoading.value = true;
      store.commit("SET_LAST_LOADED", Date.now());

      await readAndParseMaps();

      isLoading.value = false;
    };

    onBeforeMount(loadMaps);

    const deleteMap = async (i: number) => {
      const map = store.state.installedMaps[i];
      const path = pathParse(map.parkFile);

      store.commit("REMOVE_INSTALLED_MAP", i);

      try {
        await removeDir(path.dir, { recursive: true });
      } catch (error) {
        return;
      }
    };

    return {
      loadMaps,
      isLoading,
      deleteMap,
      icons: {
        trash: trashIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
