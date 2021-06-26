<template>
  <div class="rounded-full from-primary-500 to-accent-400 loading-bar"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SSpinnerBar",
  components: {},
});
</script>

<style lang="scss" scoped>
.loading-bar {
  --speed: 3s;
  background: linear-gradient(
    270deg,
    var(--tw-gradient-from),
    var(--tw-gradient-to)
  );
  background-size: 400% 400%;

  -webkit-animation: loading var(--speed) ease infinite;
  -moz-animation: loading var(--speed) ease infinite;
  animation: loading var(--speed) ease infinite;
}

@-webkit-keyframes loading {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes loading {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes loading {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>