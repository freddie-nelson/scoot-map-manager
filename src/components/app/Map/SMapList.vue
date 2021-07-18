<template>
  <section class="max-h-full">
    <s-map-card
      v-for="(map, i) in maps"
      :key="`${i}-${map.name}`"
      :map="map"
      :buttonIcon="buttonIcon"
      :buttonIcon2="buttonIcon2"
      :buttonIconName="buttonIconName"
      @clicked="$emit('map-clicked', i)"
      @clicked-2="$emit('map-clicked-2', i)"
      @clicked-name="$emit('map-clicked-name', i)"
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
    buttonIcon2: {
      type: Object,
      default: null,
    },
    buttonIconName: {
      type: Object,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
section {
  display: grid;
  gap: 1.4rem;
  grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));
}
</style>