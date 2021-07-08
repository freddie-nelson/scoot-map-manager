<template>
  <main>
    <s-modal v-if="$store.state.user && !$store.state.user.emailVerified">
      <s-gradient-heading :size="5" noScale>Verify Email</s-gradient-heading>
      <p v-if="verifyTimer === 0" class="mt-3 text-lg font-medium">
        You must verify your email before continuing.
      </p>
      <p v-else class="mt-3 text-lg font-medium">
        You can request verification again in {{ verifyTimer }}s.
      </p>
      <s-button class="mt-5" @click="verifyEmail">Send Email</s-button>
    </s-modal>

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
import { defineComponent, onUnmounted, ref } from "vue";
import {
  getAuth,
  signOut as firebaseSignOut,
  sendEmailVerification,
} from "@firebase/auth";

import SProfileInfo from "@/components/app/Profile/SProfileInfo.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SButtonDanger from "@/components/shared/Button/SButtonDanger.vue";
import SModal from "@/components/shared/Modal/SModal.vue";
import SButton from "@/components/shared/Button/SButton.vue";

export default defineComponent({
  name: "Profile",
  components: {
    SProfileInfo,
    SGradientHeading,
    SButtonDanger,
    SModal,
    SButton,
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

    const verifyTimer = ref(0);

    const verifyInterval = setInterval(() => {
      if (verifyTimer.value > 0) verifyTimer.value--;
    }, 1000);
    onUnmounted(() => {
      clearInterval(verifyInterval);
    });

    const verifyEmail = async () => {
      if (verifyTimer.value > 0) return;

      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        verifyTimer.value = 120;
      }
    };

    return {
      signOut,
      verifyTimer,
      verifyEmail,
    };
  },
});
</script>

<style lang="scss" scoped></style>
