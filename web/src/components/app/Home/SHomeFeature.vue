<template>
  <div class="flex items-center">
    <Icon class="w-7 h-7 mr-4" :icon="icon" />
    <p class="text-xl font-medium opacity-80">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Icon } from "@iconify/vue";

export default defineComponent({
  name: "SHomeFeature",
  components: {
    Icon,
  },
  props: {
    icon: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
