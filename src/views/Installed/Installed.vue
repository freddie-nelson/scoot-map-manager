<template>
  <main class="overflow-y-scroll">
    <header
      class="mb-11 flex justify-between items-center"
      :class="$route.name !== 'Installed' ? 'py-2 ' : ''"
    >
      <div class="flex">
        <router-link
          class="transition-opacity duration-300"
          :class="{ 'opacity-50': $route.name !== 'Installed' }"
          :to="{ name: 'Installed' }"
        >
          <s-gradient-heading :size="4">Installed Maps</s-gradient-heading>
        </router-link>

        <router-link
          class="ml-8 transition-opacity duration-300"
          :class="{ 'opacity-50': $route.name !== 'InstalledUploaded' }"
          :to="{ name: 'InstalledUploaded' }"
        >
          <s-gradient-heading :size="4">Uploaded Maps</s-gradient-heading>
        </router-link>
      </div>

      <div v-if="$route.name === 'Installed'">
        <s-button
          @click="$router.push({ name: 'Setup' })"
          class="transform scale-90"
        >
          Locate Folder
        </s-button>
        <s-button @click="loadMaps(true)" class="ml-5 transform scale-90">
          Refresh Maps
        </s-button>
      </div>
    </header>

    <div v-if="$store.state.isLoadingInstalled">
      <s-gradient-heading class="text-center mt-32" :size="5">
        Loading Maps...
      </s-gradient-heading>
      <s-spinner-bar class="h-5 mt-10 w-full max-w-2xl px-8 mx-auto" />
    </div>

    <router-view v-show="!$store.state.isLoadingInstalled" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "Installed",
  components: {
    SGradientHeading,
    SButton,
    SSpinnerBar,
  },
});
</script>

<style lang="scss" scoped></style>
