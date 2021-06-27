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

    <div v-if="isLoading">
      <s-gradient-heading class="text-center mt-32" :size="5">
        Loading Maps...
      </s-gradient-heading>
      <s-spinner-bar class="h-5 mt-10 w-full max-w-2xl px-8 mx-auto" />
    </div>

    <s-map-list
      v-else
      :maps="$store.state.installedMaps"
      :buttonIcon="icons.trash"
      :buttonIcon2="icons.upload"
      @map-clicked="deleteMap"
      @map-clicked-2="uploadMap"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import useInstalledMaps from "@/hooks/useInstalledMaps";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

import trashIcon from "@iconify-icons/feather/trash";
import uploadIcon from "@iconify-icons/feather/upload";

export default defineComponent({
  name: "Installed",
  components: {
    SGradientHeading,
    SMapList,
    SButton,
    SSpinnerBar,
  },
  setup() {
    const { readAndParseMaps, deleteMap, uploadMap } = useInstalledMaps();

    const isLoading = ref(false);

    const loadMaps = async (force = false) => {
      if (isLoading.value) return;

      isLoading.value = true;

      await readAndParseMaps(force);

      isLoading.value = false;
    };

    onBeforeMount(loadMaps);

    return {
      loadMaps,
      isLoading,
      deleteMap,
      uploadMap,
      icons: {
        trash: trashIcon,
        upload: uploadIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
