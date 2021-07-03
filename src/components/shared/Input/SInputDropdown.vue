<template>
  <div ref="dropdown" class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center rounded-md bg-input-blur px-4 font-medium"
    >
      <p
        class="transition-colors duration-300"
        :class="{ 'text-primary-500': showDropdown }"
      >
        {{ selected }}
      </p>
      <Icon
        class="
          ml-2.5
          transform
          scale-110
          my-0.5
          transition-transform
          duration-300
        "
        :class="{ 'rotate-180': showDropdown }"
        :icon="icons.chevronDown"
      />
    </button>

    <div
      v-if="showDropdown"
      class="
        absolute
        w-full
        p-3
        pl-2
        bg-input-blur
        rounded-md
        left-0
        top-full
        -mt-4
        z-10
      "
    >
      <button
        v-for="item in items.filter((item) => item !== selected)"
        :key="item"
        @click="
          $emit('selected', item);
          showDropdown = false;
        "
        class="
          mt-2
          p-2
          rounded-md
          opacity-70
          hover:opacity-100
          transition-opacity
          duration-300
          font-medium
          text-left
        "
      >
        <p>{{ item }}</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import useComponentEvent from "@/hooks/useComponentEvent";

import { Icon } from "@iconify/vue";
import chevronDownIcon from "@iconify-icons/feather/chevron-down";

export default defineComponent({
  name: "SInputDropdown",
  components: {
    Icon,
  },
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selected: {
      default: null,
    },
  },
  setup() {
    const dropdown = ref(document.createElement("div"));
    const showDropdown = ref(false);

    useComponentEvent(document.body, "click", (e) => {
      if (
        showDropdown.value &&
        dropdown.value.compareDocumentPosition(e.target as Node) &
          Node.DOCUMENT_POSITION_CONTAINED_BY
      )
        return;

      showDropdown.value = false;
    });

    return {
      dropdown,
      showDropdown,

      icons: {
        chevronDown: chevronDownIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
</style>