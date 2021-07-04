<template>
  <s-modal class="max-w-2xl w-full">
    <s-gradient-heading class="mb-5" :size="4" noScale>
      Downloading Map...
    </s-gradient-heading>
    <s-spinner-bar class="h-4 w-full" />
  </s-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SModal from "@/components/shared/Modal/SModal.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "SModalsDownload",
  components: {
    SModal,
    SGradientHeading,
    SSpinnerBar,
  },
});
</script>

<style lang="
    SGradientHeadingscss" scoped>
</style>