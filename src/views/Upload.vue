<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading class="text-center" :size="5" noscale>
      {{ !isUploading ? "Upload Map" : "Uploading..." }}
    </s-gradient-heading>

    <form
      v-if="!isUploading && !showSuccessMsg"
      class="flex flex-col max-w-xl w-full px-4 mt-8"
      @submit.prevent="upload"
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

    <s-spinner-bar
      v-else-if="!showSuccessMsg"
      class="h-5 max-w-xl w-full px-4 mt-8"
    />

    <div v-else-if="showSuccessMsg" class="text-center">
      <p class="font-semibold text-2xl max-w-4xl px-3 my-6">
        Your map was successfully uploaded, however it may take up to 10 minutes
        for it to be published to
        <router-link
          class="
            text-accent-400
            underline
            hover:text-primary-500
            transition-colors
            duration-300
          "
          to="/maps"
        >
          Global Maps
        </router-link>
        .
      </p>

      <s-button @click.once="$router.push({ name: 'Installed' })">
        Back to Maps
      </s-button>
    </div>
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

    const showSuccessMsg = ref(false);

    const upload = async () => {
      if (!map.value || !map.value.name) return;

      map.value.name = map.value.name.trim();

      const res = await uploadMap(map.value);
      if (!res) return;

      showSuccessMsg.value = true;
      store.commit("SET_REFRESH_UPLOADED", true);
    };

    return {
      map,
      isNameTaken,
      uploadFailed,
      isUploading,
      upload,
      showSuccessMsg,
    };
  },
});
</script>

<style lang="scss" scoped></style>
