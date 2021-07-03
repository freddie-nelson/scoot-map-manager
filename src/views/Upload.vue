<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading class="text-center" :size="5" noscale>
      {{ !isUploading ? "Upload Map" : "Uploading..." }}
    </s-gradient-heading>

    <form
      v-if="!isUploading"
      class="flex flex-col max-w-xl w-full px-4 mt-8"
      @submit.prevent="uploadMap(map)"
    >
      <s-input-text
        v-model="map.name"
        name="mapName"
        placeholder="My Epic Map"
        label="Map Name"
      />
      <s-form-error v-if="isNameTaken" class="mt-2"
        >That name is already taken.</s-form-error
      >
      <s-form-error v-if="uploadFailed" class="mt-2"
        >An error occurred while uploading.</s-form-error
      >

      <s-button class="mt-5" type="submit">Upload</s-button>
    </form>

    <s-spinner-bar v-else class="h-5 max-w-xl w-full px-4 mt-8" />
  </main>
</template>

<script lang="ts">
import { Map, useStore } from "@/store";
import { defineComponent, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import useUploadMap from "@/hooks/useUploadMap";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SFormError from "@/components/shared/Form/SFormError.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "Profile",
  components: {
    SGradientHeading,
    SInputText,
    SButton,
    SFormError,
    SSpinnerBar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const map = ref<Map>();

    onBeforeMount(() => {
      if (!store.state.user) return router.push({ name: "Register" });
      else if (!store.state.user.emailVerified)
        return router.push({ name: "Profile" });
      else if (store.state.installedMaps.length === 0)
        return router.push({ name: "Installed" });

      const index = Number(router.currentRoute.value.params.mapIndex);
      if (
        isNaN(index) ||
        index < 0 ||
        index >= store.state.installedMaps.length
      )
        return router.push({ name: "Installed" });

      map.value = { ...store.state.installedMaps[index] };
    });

    const { isNameTaken, uploadFailed, isUploading, uploadMap } =
      useUploadMap(map);

    return {
      map,
      isNameTaken,
      uploadFailed,
      isUploading,
      uploadMap,
    };
  },
});
</script>

<style lang="scss" scoped></style>
