<template>
  <h1
    class="
      pb-2
      font-bold
      bg-clip-text
      text-transparent
      bg-gradient-to-r
      from-primary-500
      to-accent-400
    "
    :class="
      noscale
        ? `text-${size}xl`
        : `text-${Math.ceil(size - size / 4)}xl md:text-${size}xl`
    "
  >
    <slot></slot>
  </h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SGradientHeading",
  components: {},
  props: {
    size: {
      type: Number,
      default: 9,
    },
    noscale: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
</style>