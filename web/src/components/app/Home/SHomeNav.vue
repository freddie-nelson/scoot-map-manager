<template>
  <nav class="w-full py-6 px-10 flex justify-between items-center bg-bg-dark">
    <router-link to="/">
      <s-gradient-heading :size="3">SCOOT Map Manager</s-gradient-heading>
    </router-link>
    <s-button-outline
      class="transform scale-90"
      type="download"
      @click="$emit('download')"
    >
      Download
    </s-button-outline>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SButtonOutline from "@/components/shared/Button/SButtonOutline.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";

export default defineComponent({
  name: "SnavTop",
  components: {
    SGradientHeading,
    SButtonOutline,
  },
});
</script>

<style lang="scss" scoped>
</style>