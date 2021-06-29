<template>
  <s-button class="bg-danger-600 hover:bg-danger-900 focus:bg-danger-900">
    <slot></slot>
  </s-button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "SButtonDanger",
  components: {
    SButton,
  },
});
</script>

<style lang="scss" scoped>
</style>