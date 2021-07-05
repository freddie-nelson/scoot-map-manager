<template>
  <div>
    <s-map-list
      v-if="$store.state.installedMaps.length > 0"
      :maps="$store.state.installedMaps"
      :buttonIcon="icons.trash"
      :buttonIcon2="icons.upload"
      @map-clicked="mapToDelete = $store.state.installedMaps[$event]"
      @map-clicked-2="uploadMap"
    />

    <h1 v-else class="font-semibold text-2xl text-center py-10 opacity-60">
      You don't have any maps installed,
      <router-link
        class="
          cursor-pointer
          text-primary-500
          hover:text-accent-500
          transtion-colors
          duration-300
          underline
        "
        to="Maps"
        >Download some made by other users!</router-link
      >
    </h1>

    <s-modals-delete
      v-if="mapToDelete"
      :isDeleting="isDeleting"
      :isFail="showDeleteFail"
      :map="mapToDelete"
      @close="mapToDelete = undefined"
      @delete="deleteMap"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, watch, ref } from "vue";
import { Map, useStore } from "@/store";
import useInstalledMaps from "@/hooks/useInstalledMaps";

import SMapList from "@/components/app/Map/SMapList.vue";
import SModalsDelete from "@/components/app/Modals/SModalsDelete.vue";

import trashIcon from "@iconify-icons/feather/trash";
import uploadIcon from "@iconify-icons/feather/upload";

export default defineComponent({
  name: "name",
  components: {
    SMapList,
    SModalsDelete,
  },
  props: {
    executeLoadMaps: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const {
      readAndParseMaps,
      deleteMap: deleteMapFS,
      uploadMap,
    } = useInstalledMaps();

    const loadMaps = async (force = false) => {
      if (store.state.isLoadingInstalled) return;

      store.commit("SET_LOADING_INSTALLED", true);

      await readAndParseMaps(force);

      store.commit("SET_LOADING_INSTALLED", false);
    };

    onBeforeMount(loadMaps);

    watch(
      computed(() => props.executeLoadMaps),
      () => {
        loadMaps(true);
      }
    );

    const mapToDelete = ref<Map>();
    const isDeleting = ref(false);
    const showDeleteFail = ref(false);

    const deleteMap = async () => {
      if (!mapToDelete.value) return;

      isDeleting.value = true;

      const success = await deleteMapFS(mapToDelete.value);
      if (!success) {
        showDeleteFail.value = true;
        isDeleting.value = false;
        return;
      }

      mapToDelete.value = undefined;
      isDeleting.value = false;
    };

    return {
      loadMaps,
      uploadMap,

      mapToDelete,
      isDeleting,
      showDeleteFail,
      deleteMap,

      icons: {
        trash: trashIcon,
        upload: uploadIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>