<template>
  <s-nav-titlebar />
  <s-nav-sidebar />
  <router-view
    v-if="!isLoading"
    class="w-full h-full p-14 -ml-24 bg-bg-dark text-t-main relative"
  />
  <main
    v-else
    class="
      flex flex-col
      w-full
      h-full
      p-14
      -ml-24
      bg-bg-dark
      text-t-main
      relative
      justify-center
      items-center
    "
  >
    <s-gradient-heading :size="5">Loading App...</s-gradient-heading>
    <s-spinner-bar class="mt-6 max-w-3xl w-full h-5 px-10" />
  </main>

  <!-- force tailwind to load all font sizes -->
  <h1
    class="
      hidden
      text-xs
      text-sm
      text-base
      text-lg
      text-xl
      text-2xl
      text-3xl
      text-4xl
      text-5xl
      text-6xl
    "
  ></h1>
</template>

<script>
import { onMounted, ref } from "vue";

import SNavSidebar from "@/components/app/Nav/SNavSidebar.vue";
import SNavTitlebar from "./components/app/Nav/SNavTitlebar.vue";
import SSpinnerBar from "./components/shared/Spinner/SSpinnerBar.vue";
import SGradientHeading from "./components/shared/Heading/SGradientHeading.vue";

export default {
  name: "App",
  components: {
    SNavSidebar,
    SNavTitlebar,
    SSpinnerBar,
    SGradientHeading,
  },
  setup() {
    const isLoading = ref(true);

    onMounted(() => {
      const interval = setInterval(() => {
        if (window.magick && window.magick.Call) {
          isLoading.value = false;
          clearInterval(interval);
        }
      }, 100);
    });

    return {
      isLoading,
    };
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  border-radius: 1rem;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
}

main {
  border-radius: 1rem;
}

::-webkit-scrollbar {
  width: 0.7rem;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 0.25rem;
}
</style>
