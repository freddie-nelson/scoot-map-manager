<template>
  <s-sidebar />
  <router-view class="w-full h-full p-14 -ml-24 bg-bg-dark text-t-main" />
</template>

<script>
import SSidebar from "@/components/app/Nav/SSidebar.vue";

export default {
  name: "App",
  components: {
    SSidebar,
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
