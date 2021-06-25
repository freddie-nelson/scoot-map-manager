<template>
  <section class="max-h-full">
    <s-map-card
      v-for="(map, i) in maps"
      :key="i"
      :map="map"
      :buttonIcon="buttonIcon"
      @clicked="$emit('map-clicked', i)"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Map } from "@/store";

import SMapCard from "./SMapCard.vue";

import downloadIcon from "@iconify-icons/feather/download";

export default defineComponent({
  name: "SMapList",
  components: {
    SMapCard,
  },
  props: {
    maps: {
      type: Array as () => Map[],
      required: true,
    },
    buttonIcon: {
      type: Object,
      default: downloadIcon,
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  display: grid;
  grid-gap: 1.4rem;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
}
</style>