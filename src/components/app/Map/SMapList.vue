<template>
  <s-map-card
    v-for="map in maps"
    :key="map.name"
    :map="map"
    :buttonIcon="buttonIcon"
  />
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
      default() {
        return [];
      },
    },
    buttonIcon: {
      type: Object,
      default() {
        return downloadIcon;
      },
    },
  },
});
</script>

<style lang="scss" scoped>
</style>