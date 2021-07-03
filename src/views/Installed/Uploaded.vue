<template>
  <div>
    <s-map-list
      v-if="maps.length > 0"
      :maps="maps"
      :buttonIcon="icons.trash"
      @map-clicked="deleteMap"
    />

    <h1 v-else class="font-semibold text-3xl text-center py-10 opacity-60">
      You haven't uploaded any maps yet.
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Map, useStore } from "@/store";
import useUserMaps from "@/hooks/useUserMaps";

import SMapList from "@/components/app/Map/SMapList.vue";

import trashIcon from "@iconify-icons/feather/trash";

export default defineComponent({
  name: "name",
  components: {
    SMapList,
  },
  setup() {
    const store = useStore();

    const maps = ref<Map[]>([]);
    const { search, deleteMap: deleteMapDB } = useUserMaps(maps);

    const loadMaps = async () => {
      if (store.state.isLoadingInstalled || !store.state.user) return;

      store.commit("SET_LOADING_INSTALLED", true);

      await search(`creatorId:${store.state.user.uid}`);

      store.commit("SET_LOADING_INSTALLED", false);
    };

    const deleteMap = (i: number) => {
      if (i < 0 || i >= maps.value.length) return;

      deleteMapDB(maps.value[i]);
      maps.value.splice(i, 1);
    };

    onBeforeMount(loadMaps);

    return {
      maps,
      loadMaps,
      deleteMap,
      icons: {
        trash: trashIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>