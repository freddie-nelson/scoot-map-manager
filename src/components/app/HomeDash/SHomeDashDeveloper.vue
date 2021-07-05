<template>
  <s-dashboard-card class="flex flex-col">
    <s-home-dash-title>Support Development</s-home-dash-title>

    <p class="font-medium mt-4 mb-5 opacity-70">
      Hey
      {{
        $store.state.user && $store.state.user.email
          ? `${
              $store.state.user.displayName ||
              $store.state.user.email.split("@")[0]
            }`
          : "SCOOT fan"
      }}! I'm Freddie, the developer of SCOOT map manager. Server costs aren't
      free, so if you love SMM I would greatly appreciate it if you could help
      keep it alive. Thanks! &lt;3
    </p>

    <s-button @click="openDonateLink" class="w-full mt-auto">Donate</s-button>
  </s-dashboard-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { open } from "@tauri-apps/api/shell";

import SDashboardCard from "@/components/app/Dashboard/SDashboardCard.vue";
import SHomeDashTitle from "./SHomeDashTitle.vue";
import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "SHomeDashDeveloper",
  components: {
    SDashboardCard,
    SHomeDashTitle,
    SButton,
  },
  setup() {
    const openDonateLink = async () => {
      try {
        await open("https://ko-fi.com/xdfreddie");
      } catch (error) {
        console.log(error);
        return;
      }
    };

    return {
      openDonateLink,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>