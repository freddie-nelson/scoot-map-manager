<template>
  <main class="flex flex-col overflow-y-scroll">
    <header class="mb-10 flex justify-between items-center">
      <s-gradient-heading :size="4">
        {{
          $store.state.user && $store.state.user.email
            ? `Welcome back, ${
                $store.state.user.displayName ||
                $store.state.user.email.split("@")[0]
              }`
            : "Welcome to SCOOT Map Manager"
        }}
      </s-gradient-heading>
    </header>

    <div class="flex-grow">
      <s-dashboard class="dashboard">
        <s-home-dash-featured style="grid-area: fm" />
        <s-home-dash-stats style="grid-area: s" />
        <s-home-dash-patch style="grid-area: pn" />
        <s-home-dash-developer style="grid-area: d" />
      </s-dashboard>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SDashboard from "@/components/app/Dashboard/SDashboard.vue";
import SHomeDashFeatured from "@/components/app/HomeDash/SHomeDashFeatured.vue";
import SHomeDashPatch from "@/components/app/HomeDash/SHomeDashPatch.vue";
import SHomeDashStats from "@/components/app/HomeDash/SHomeDashStats.vue";
import SHomeDashDeveloper from "@/components/app/HomeDash/SHomeDashDeveloper.vue";

export default defineComponent({
  name: "Home",
  components: {
    SGradientHeading,
    SDashboard,
    SHomeDashFeatured,
    SHomeDashPatch,
    SHomeDashStats,
    SHomeDashDeveloper,
  },
});
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
  width: 100%;
  grid-gap: 1rem;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "fm fm fm fm fm fm s s s s"
    "fm fm fm fm fm fm s s s s"
    "pn pn pn pn pn pn d d d d";
}
</style>
