<template>
  <main class="overflow-y-scroll">
    <header class="mb-8 flex justify-between items-center">
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
import { defineComponent, ref } from "vue";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import { Map } from "@/store";

export default defineComponent({
  name: "Maps",
  components: {
    SGradientHeading,
    SInputText,
    SMapList,
    SButton,
  },
  setup() {
    const maps = ref<Map[]>([]);
    const isLoading = ref(false);

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
