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
      class="
        flex flex-col
        justify-center
        items-center
        max-w-2xl
        w-full
        p-12
        rounded-lg
        bg-input-focus
      "
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";

export default defineComponent({
  name: "SModal",
  components: {},
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
    };
  },
});
</script>

<style lang="scss" scoped>
</style>