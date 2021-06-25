<template>
  <div
    class="
      p-4
      bg-danger-900
      border-2 border-danger-700
      rounded-md
      text-danger-300
    "
  >
    <p><slot></slot></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SFormError",
  components: {},
});
</script>

<style lang="scss" scoped>
</style>