<template>
  <s-dashboard-card></s-dashboard-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SDashboardCard from "@/components/app/Dashboard/SDashboardCard.vue";

export default defineComponent({
  name: "SHomeDashPatch",
  components: {
    SDashboardCard,
  },
});
</script>

<style lang="scss" scoped>
</style>