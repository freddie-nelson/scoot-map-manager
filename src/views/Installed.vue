<template>
  <main>
    <header class="mb-8 flex justify-between items-center">
      <s-gradient-heading :size="4">Installed Maps</s-gradient-heading>
      <s-button
        @click="$router.push({ name: 'Setup' })"
        class="transform scale-90"
        >Locate Folder
      </s-button>
    </header>
    <s-map-list :maps="$store.state.installedMaps" :buttonIcon="icons.trash" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SMapList from "@/components/app/Map/SMapList.vue";

import trashIcon from "@iconify-icons/feather/trash";
import { useStore } from "@/store";
import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "Installed",
  components: {
    SGradientHeading,
    SMapList,
    SButton,
  },
  setup() {
    const store = useStore();
    console.log(store.state.mapsDir);

    return {
      icons: {
        trash: trashIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
