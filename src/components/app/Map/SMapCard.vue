<template>
  <div
    class="
      h-64
      max-w-sm
      w-full
      bg-input-blur
      rounded-lg
      border-4 border-input-blur
      flex flex-col
      relative
    "
  >
    <div
      class="w-full h-full rounded-md bg-input-focus bg-cover"
      :style="{ backgroundImage: `url(${map.image})` }"
    />

    <div
      class="
        absolute
        w-full
        h-full
        bg-gradient-to-t
        from-bg-dark
        via-transparent
        to-transparent
        rounded-md
      "
    ></div>

    <div
      class="
        bg-transparent
        p-3
        rounded-b-md
        text-t-main
        flex
        justify-between
        items-center
        absolute
        w-full
        bottom-0
      "
    >
      <div class="font-medium">
        <p>{{ map.name || "Map Name" }}</p>
        <p class="text-xs opacity-60">{{ map.creator || "Creator" }}</p>
      </div>

      <button
        class="
          w-6
          h-6
          mr-2
          focus:outline-none
          hover:text-primary-600
          focus:text-primary-600
          transition-colors
          duration-300
        "
        @click="$emit('clicked')"
      >
        <Icon class="w-full h-full" :icon="buttonIcon" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Map } from "@/store";

import { Icon } from "@iconify/vue";
import downloadIcon from "@iconify-icons/feather/download";

export default defineComponent({
  name: "SMapCard",
  components: {
    Icon,
  },
  props: {
    map: {
      type: Object as () => Map,
      default() {
        return {};
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