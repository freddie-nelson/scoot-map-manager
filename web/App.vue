<template>
  <router-view class="w-full h-full p-14 bg-bg-dark text-t-main relative" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {},
});
</script>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
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
