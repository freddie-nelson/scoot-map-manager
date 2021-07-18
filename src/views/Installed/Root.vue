<template>
  <div>
    <s-map-list
      v-if="$store.state.installedMaps.length > 0"
      :maps="$store.state.installedMaps"
      :buttonIcon="icons.trash"
      :buttonIcon2="icons.upload"
      :buttonIconName="icons.edit"
      @map-clicked="mapToDelete = $store.state.installedMaps[$event]"
      @map-clicked-2="uploadMap"
      @map-clicked-name="
        mapToRename = $store.state.installedMaps[$event];
        newName = mapToRename.name;
      "
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
      >
        Download some made by other users!
      </router-link>
    </h1>

    <s-modals-delete
      v-if="mapToDelete"
      :isDeleting="isDeleting"
      :isFail="showDeleteFail"
      :map="mapToDelete"
      @close="mapToDelete = undefined"
      @delete="deleteMap"
    />

    <s-modal v-if="mapToRename" @close="mapToRename = undefined" closeable>
      <s-gradient-heading :size="4">
        Rename {{ mapToRename.name }}
      </s-gradient-heading>

      <s-input-text
        class="mt-4 w-full"
        style="min-width: 24rem"
        name="Map Name"
        v-model="newName"
      />

      <s-button
        class="mt-5 w-full"
        @click="
          renameMap(mapToRename, newName);
          mapToRename = undefined;
        "
      >
        Rename
      </s-button>
    </s-modal>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, watch, ref } from "vue";
import { Map, useStore } from "@/store";
import useInstalledMaps from "@/hooks/useInstalledMaps";

import SMapList from "@/components/app/Map/SMapList.vue";
import SModalsDelete from "@/components/app/Modals/SModalsDelete.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";

import trashIcon from "@iconify-icons/feather/trash";
import uploadIcon from "@iconify-icons/feather/upload";
import editIcon from "@iconify-icons/feather/edit-2";
import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "name",
  components: {
    SMapList,
    SModalsDelete,
    SModal,
    SGradientHeading,
    SInputText,
    SButton,
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
      renameMap,
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

    const mapToRename = ref<Map>();
    const newName = ref("");

    return {
      loadMaps,
      uploadMap,

      mapToDelete,
      isDeleting,
      showDeleteFail,
      deleteMap,

      mapToRename,
      newName,
      renameMap,

      icons: {
        trash: trashIcon,
        upload: uploadIcon,
        edit: editIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>