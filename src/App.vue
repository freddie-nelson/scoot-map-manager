<template>
  <s-nav-titlebar />
  <s-nav-sidebar />
  <router-view
    class="w-full h-full p-14 -ml-24 bg-bg-dark text-t-main relative"
  />
</template>

<script>
import SNavSidebar from "@/components/app/Nav/SNavSidebar.vue";
import SNavTitlebar from "./components/app/Nav/SNavTitlebar.vue";

export default {
  name: "App",
  components: {
    SNavSidebar,
    SNavTitlebar,
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
</style>
