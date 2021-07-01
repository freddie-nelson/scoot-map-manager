<template>
  <main>
    <header class="mb-11 flex justify-between items-center">
      <s-gradient-heading :size="4">My Profile</s-gradient-heading>

      <s-button-danger class="transform scale-90" @click="signOut">
        Sign Out
      </s-button-danger>
    </header>
    <s-profile-info />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAuth, signOut as firebaseSignOut } from "@firebase/auth";

import SProfileInfo from "@/components/app/Profile/SProfileInfo.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SButtonDanger from "@/components/shared/Button/SButtonDanger.vue";

export default defineComponent({
  name: "Profile",
  components: {
    SProfileInfo,
    SGradientHeading,
    SButtonDanger,
  },
  setup() {
    const auth = getAuth();

    const signOut = async () => {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    return {
      signOut,
    };
  },
});
</script>

<style lang="scss" scoped></style>
