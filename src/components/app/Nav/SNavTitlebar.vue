<template>
  <div
    data-tauri-drag-region
    class="
      absolute
      top-0
      left-0
      z-10
      w-full
      flex flex-col
      items-center
      justify-center
      rounded-t-xl
    "
  >
    <div
      class="
        self-end
        flex
        justify-between
        transform
        scale-95
        origin-top-right
        bg-bg-dark
        rounded-tr-xl rounded-bl-xl
        px-4
        py-3.5
      "
    >
      <button
        @click="minimize"
        class="
          w-6
          h-6
          focus:outline-none
          text-t-main
          opacity-60
          hover:opacity-100
          transition-opacity
          duration-300
        "
      >
        <Icon class="w-full h-full" :icon="icons.minimize" />
      </button>

      <button
        @click="toggleMaximize"
        class="
          w-6
          h-6
          focus:outline-none
          text-t-main
          opacity-60
          hover:opacity-100
          transition-opacity
          duration-300
          mx-8
        "
      >
        <Icon
          v-if="showMaximize"
          class="w-full h-full"
          :icon="icons.maximize"
        />
        <Icon v-else class="w-full h-full" :icon="icons.unmaximize" />
      </button>

      <button
        @click="close"
        class="
          w-6
          h-6
          focus:outline-none
          text-t-main
          opacity-60
          hover:opacity-100
          transition-opacity
          duration-300
        "
      >
        <Icon class="w-full h-full" :icon="icons.close" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { appWindow } from "@tauri-apps/api/window";

import { Icon } from "@iconify/vue";
import closeIcon from "@iconify-icons/feather/x";
import maximizeIcon from "@iconify-icons/feather/maximize";
import unmaximizeIcon from "@iconify-icons/feather/minimize";
import minimizeIcon from "@iconify-icons/feather/minus";

export default defineComponent({
  name: "SNavTitlebar",
  components: {
    Icon,
  },
  setup() {
    const showMaximize = ref(true);

    onMounted(async () => {
      showMaximize.value = !(await appWindow.isMaximized());
    });

    return {
      minimize: appWindow.minimize,

      showMaximize,
      toggleMaximize: async () => {
        try {
          if (await appWindow.isMaximized()) {
            showMaximize.value = true;
            await appWindow.unmaximize();
          } else {
            showMaximize.value = false;
            await appWindow.maximize();
          }
        } catch (e) {
          console.log(e);
          return;
        }
      },

      close: appWindow.close,

      icons: {
        close: closeIcon,
        maximize: maximizeIcon,
        unmaximize: unmaximizeIcon,
        minimize: minimizeIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>