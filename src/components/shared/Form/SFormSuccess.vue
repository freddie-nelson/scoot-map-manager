<template>
  <div
    class="
      p-4
      bg-success-900
      border-2 border-success-700
      rounded-md
      text-success-300
    "
  >
    <p><slot></slot></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SFormSuccess",
  components: {},
});
</script>

<style lang="scss" scoped>
</style>