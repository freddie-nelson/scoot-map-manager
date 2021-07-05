<template>
  <s-modal class="max-w-4xl w-full">
    <div v-if="!isDeleting" class="text-center">
      <s-gradient-heading :size="4">
        Are you sure you want to delete {{ map.name }}?
      </s-gradient-heading>

      <div class="mt-4">
        <s-button class="mr-4" @click="$emit('close')">No</s-button>
        <s-button-danger @click="$emit('delete')">Yes</s-button-danger>
      </div>
    </div>

    <div v-else-if="isDeleting">
      <s-gradient-heading :size="4">
        Deleting {{ map.name }}...
      </s-gradient-heading>

      <s-spinner-bar class="w-full h-5 mt-4" />
    </div>

    <div v-else-if="isFail" class="text-center">
      <p class="mb-6 mt-3 font-semibold text-2xl">
        An error occurred while deleting the map.
      </p>

      <s-button @click="$emit('close')">Close</s-button>
    </div>
  </s-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import { Map } from "@/store";
import SButtonDanger from "@/components/shared/Button/SButtonDanger.vue";

export default defineComponent({
  name: "SModalsDelete",
  components: {
    SModal,
    SGradientHeading,
    SSpinnerBar,
    SButton,
    SButtonDanger,
  },
  props: {
    map: {
      type: Object as () => Map,
    },
    isDeleting: {
      type: Boolean,
      default: false,
    },
    isFail: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
</style>