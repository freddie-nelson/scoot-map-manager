<template>
  <div>
    <label
      v-if="label"
      class="block text-t-sub font-medium mb-0.5"
      :for="name"
      >{{ label }}</label
    >
    <input
      class="
        w-full
        block
        p-3
        border-solid border-2
        rounded-lg
        text-t-main
        border-b-light
        focus:outline-none
        focus:border-b-highlight
        transition-colors
        duration-300
        bg-input-blur
        focus:bg-input-focus
      "
      :type="censor ? 'password' : 'text'"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SInputText",
  components: {},
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
    censor: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
</style>