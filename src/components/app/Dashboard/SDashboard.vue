<template>
  <section class="grid">
    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SDashboard",
  components: {},
});
</script>

<style lang="scss" scoped></style>