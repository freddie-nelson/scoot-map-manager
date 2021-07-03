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
        <s-button class="ml-2.5 py-3 h-full" @click="search(searchTerm)"
          >Search</s-button
        >
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
    <s-modal v-if="isDownloading">
      <s-gradient-heading class="mb-5" :size="4" noScale>
        Downloading Map...
      </s-gradient-heading>
      <s-spinner-bar class="h-4 w-full" />
    </s-modal>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import useUserMaps from "@/hooks/useUserMaps";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import { Map } from "@/store";

export default defineComponent({
  name: "Maps",
  components: {
    SGradientHeading,
    SInputText,
    SMapList,
    SButton,
    SSpinnerBar,
    SModal,
  },
  setup() {
    const maps = ref<Map[]>([]);
    const searchTerm = ref("");

    const {
      isLoading,
      nextPage,
      previousPage,
      isDownloading,
      downloadMap,
      search,
      pageNum,
    } = useUserMaps(maps);

    onBeforeMount(nextPage);

    onBeforeRouteLeave(() => {
      if (isDownloading.value) return false;
    });

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
