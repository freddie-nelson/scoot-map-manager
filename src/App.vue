<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  components: {},
  setup() {
    return {
      activeIndex: "1",
    };
  },
};
</script>

<style>
html,
body {
  width: 100vw;
  min-height: 100vh;
}
</style>
