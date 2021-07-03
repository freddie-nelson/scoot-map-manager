<template>
  <div>
    <s-map-list
      v-if="maps.length > 0"
      :maps="maps"
      :buttonIcon="icons.trash"
      @map-clicked="deleteMap"
      :buttonIcon2="icons.upload"
      @map-clicked-2="mapToUpdate = maps[$event]"
    />

    <h1 v-else class="font-semibold text-3xl text-center py-10 opacity-60">
      You haven't uploaded any maps yet.
    </h1>

    <s-modal
      v-if="mapToUpdate"
      closeable
      @close="closeUpdateModal"
      class="max-w-5xl w-full"
      style="max-height: 90%"
    >
      <div v-if="!isUploading" class="text-center">
        <s-gradient-heading :size="4">
          Update {{ mapToUpdate.name }}
        </s-gradient-heading>

        <p v-if="!showSuccessMsg" class="mt-3 font-semibold text-xl">
          Select the new map files.
        </p>
        <p v-else class="mt-3 font-semibold text-xl">
          Your map was successfully updated, however you will have to restart
          your app to see changes. Other users will be able to see the new map
          fine.
        </p>
      </div>

      <div v-else class="my-20 flex flex-col w-full items-center px-10">
        <s-gradient-heading :size="4">Updating Map...</s-gradient-heading>
        <s-spinner-bar class="w-full max-w-2xl h-5 mt-2.5" />
      </div>

      <div
        v-if="$store.state.isLoadingInstalled && !showSuccessMsg"
        class="my-20 flex flex-col w-full items-center px-10"
      >
        <s-gradient-heading :size="3">Loading Maps</s-gradient-heading>
        <s-spinner-bar class="w-full max-w-2xl h-4 mt-2.5" />
      </div>

      <p
        v-else-if="$store.state.installedMaps.length === 0 && !showSuccessMsg"
        class="my-20 text-2xl font-semibold opacity-60"
      >
        You have no maps installed.
      </p>

      <s-map-list
        v-else-if="!isUploading && !showSuccessMsg"
        class="w-full overflow-y-scroll my-8"
        style="height: 60vh"
        :maps="$store.state.installedMaps"
        :buttonIcon="icons.folderPlus"
        @map-clicked="updateMap($store.state.installedMaps[$event])"
      />
    </s-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { Map, useStore } from "@/store";
import useUserMaps from "@/hooks/useUserMaps";
import useUploadMap from "@/hooks/useUploadMap";

import SMapList from "@/components/app/Map/SMapList.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

import trashIcon from "@iconify-icons/feather/trash";
import uploadIcon from "@iconify-icons/feather/upload";
import folderPlusIcon from "@iconify-icons/feather/folder-plus";

export default defineComponent({
  name: "Uploaded",
  components: {
    SMapList,
    SModal,
    SGradientHeading,
    SSpinnerBar,
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

    onMounted(loadMaps);

    onBeforeRouteLeave(() => {
      if (store.state.isLoadingInstalled)
        store.commit("SET_LOADING_INSTALLED", false);
    });

    const mapToUpdate = ref<Map>();
    const showSuccessMsg = ref(false);

    const closeUpdateModal = () => {
      if (!isUploading.value) {
        mapToUpdate.value = undefined;
        showSuccessMsg.value = false;
      }
    };

    const { isUploading, loadImage, loadParkfile, uploadImageAndParkFile } =
      useUploadMap(mapToUpdate);

    const updateMap = async (map: Map) => {
      if (!store.state.user || !mapToUpdate.value || showSuccessMsg.value)
        return;

      isUploading.value = true;

      // load and compress image
      const image = await loadImage(map.image);
      if (!image) return;

      // read park file as binary
      const parkFile = await loadParkfile(map.parkFile);
      if (!parkFile) return;

      // upload files to cloud storage
      const uploadRes = await uploadImageAndParkFile(
        mapToUpdate.value.name,
        store.state.user.uid,
        image,
        parkFile
      );
      if (!uploadRes) return;

      isUploading.value = false;
      showSuccessMsg.value = true;
    };

    return {
      maps,
      loadMaps,
      deleteMap,
      isUploading,
      mapToUpdate,
      updateMap,
      showSuccessMsg,
      closeUpdateModal,

      icons: {
        trash: trashIcon,
        upload: uploadIcon,
        folderPlus: folderPlusIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>