<template>
  <div
    class="
      absolute
      left-0
      w-full
      h-full
      flex
      justify-center
      items-center
      bg-bg-dark bg-opacity-70
      z-10
      rounded-2xl
    "
    :style="{ top: top + 'px' }"
  >
    <div
      v-bind="$attrs"
      class="
        flex flex-col
        justify-center
        items-center
        p-12
        rounded-lg
        bg-input-focus
        relative
      "
    >
      <button
        v-if="closeable"
        class="
          absolute
          top-4
          right-4
          w-7
          h-7
          text-t-main
          hover:text-primary-500
          transition-colors
          duration-300
        "
        @click="$emit('close')"
      >
        <Icon class="w-full h-full" :icon="icons.close" />
      </button>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";

import { Icon } from "@iconify/vue";
import closeIcon from "@iconify-icons/feather/x";

export default defineComponent({
  name: "SModal",
  inheritAttrs: false,
  components: {
    Icon,
  },
  props: {
    closeable: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const top = ref(0);

    onMounted(() => {
      const main = document.getElementsByTagName("main")[0];
      main.style.overflow = "hidden";
      top.value = main.scrollTop;
    });

    onBeforeUnmount(() => {
      document.getElementsByTagName("main")[0].style.overflow = "";
    });

    return {
      top,

      icons: {
        close: closeIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>