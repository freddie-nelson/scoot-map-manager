<template>
  <s-toast
    v-if="showToast"
    :text="currentToast.text"
    @slide-out="removeToast"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watchEffect, nextTick } from "vue";
import { Toast, useStore } from "@/store";

import SToast from "./SToast.vue";

export default defineComponent({
  name: "CToastController",
  components: {
    SToast,
  },
  setup() {
    const store = useStore();

    const currentToast = ref<Toast>();
    watchEffect(() => {
      currentToast.value = store.state.toastQueue[0];
    });

    const reset = ref(false);
    const showToast = computed(() => !!currentToast.value && !reset.value);

    const removeToast = () => {
      store.commit("REMOVE_TOAST");

      reset.value = true;
      nextTick(() => (reset.value = false));
    };

    // const addToast = () => {
    //   store.commit("ADD_TOAST", { text: "The time right now is: " + Date.now() });
    // };

    return {
      showToast,
      currentToast,
      removeToast,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>