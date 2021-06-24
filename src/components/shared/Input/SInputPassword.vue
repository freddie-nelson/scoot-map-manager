<template>
  <div class="flex flex-col">
    <s-input-text
      :name="name"
      :label="label"
      :placeholder="placeholder"
      v-model="value"
      :censor="censor"
    />
    <s-button-text
      class="self-end mt-1"
      type="button"
      @click="censor = !censor"
    >
      {{ censor ? "show characters" : "hide characters" }}
    </s-button-text>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import SButtonText from "../Button/SButtonText.vue";

import SInputText from "./SInputText.vue";

export default defineComponent({
  name: "SInputPassword",
  components: {
    SInputText,
    SButtonText,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const value = ref(props.modelValue);
    watch(value, () => emit("update:modelValue", value));
    watch(
      computed(() => props.modelValue),
      () => (value.value = props.modelValue)
    );

    const censor = ref(true);

    return {
      value,
      censor,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>