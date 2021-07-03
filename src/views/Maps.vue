<template>
  <main class="overflow-y-scroll relative">
    <header class="mb-11 flex justify-between items-center">
      <s-gradient-heading :size="4">Global Maps</s-gradient-heading>

      <div class="flex">
        <s-input-dropdown
          class="mr-5 flex"
          @selected="changeOrder"
          :items="Object.keys(orders)"
          :selected="selectedOrder"
        />

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
    <s-modal v-if="isDownloading" class="max-w-2xl w-full">
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
import useUserMaps, { Order } from "@/hooks/useUserMaps";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SMapList from "@/components/app/Map/SMapList.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import { Map, useStore } from "@/store";
import SInputDropdown from "@/components/shared/Input/SInputDropdown.vue";
import { orderBy } from "@firebase/firestore";

interface Orders {
  [key: string]: Order;
}

export default defineComponent({
  name: "Maps",
  components: {
    SGradientHeading,
    SInputText,
    SMapList,
    SButton,
    SSpinnerBar,
    SModal,
    SInputDropdown,
  },
  setup() {
    const store = useStore();

    const maps = ref<Map[]>([]);
    const searchTerm = ref("");

    const {
      order,
      isLoading,
      nextPage,
      previousPage,
      isDownloading,
      downloadMap,
      search,
      pageNum,
    } = useUserMaps(maps, store.state.globalMapsOrder);

    onBeforeMount(nextPage);

    onBeforeRouteLeave(() => {
      if (isDownloading.value) return false;
    });

    const orders: Orders = {
      new: {
        field: "created_at",
        dir: "desc",
      },
      top: {
        field: "downloads",
        dir: "desc",
      },
    };
    const selectedOrder = ref<keyof typeof orders>(
      store.state.globalMapsOrderName || "new"
    );

    const changeOrder = (o: keyof typeof orders) => {
      selectedOrder.value = o;
      store.commit("SET_GLOBAL_MAPS_ORDER", { order: orders[o], name: o });

      order.value = orderBy(orders[o].field, orders[o].dir);
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
      selectedOrder,
      orders,
      changeOrder,
    };
  },
});
</script>

<style lang="scss" scoped></style>
