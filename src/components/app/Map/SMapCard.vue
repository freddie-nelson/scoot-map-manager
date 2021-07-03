<template>
  <div
    class="
      h-64
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
      :style="{ backgroundImage: `url(${map.imageEscaped || map.image})` }"
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

    <p
      v-if="map.downloads !== undefined"
      class="
        downloads-count
        absolute
        top-2
        right-2.5
        font-medium
        text-xs text-t-main
      "
    >
      downloads: {{ map.downloads }}
    </p>

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

      <div class="mr-1 flex">
        <button
          v-if="buttonIcon2"
          class="
            w-6
            h-6
            mr-5
            focus:outline-none
            hover:text-primary-600
            focus:text-primary-600
            transition-colors
            duration-300
          "
          @click="$emit('clicked-2')"
        >
          <Icon class="w-full h-full" :icon="buttonIcon2" />
        </button>

        <button
          v-if="buttonIcon"
          class="
            w-6
            h-6
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
  },
});
</script>

<style lang="scss" scoped>
.downloads-count {
  --blur: 22px;
  text-shadow: 0px 0px var(--blur) #000000, 0px 0px var(--blur) #000000,
    0px 0px var(--blur) #000000, 0px 0px var(--blur) #000000,
    0px 0px var(--blur) #000000, 0px 0px var(--blur) #000000;
}
</style>