<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading :size="6" noscale>Register</s-gradient-heading>
    <form class="max-w-xl w-full px-4 mt-10 flex flex-col" @submit.prevent>
      <s-input-text
        name="username"
        placeholder="johnsmith16"
        label="Username"
        v-model="username"
      />
      <s-input-password
        class="mt-6"
        name="password"
        label="Password"
        placeholder="securepassword123"
        v-model="password"
      />
      <s-input-text
        name="confirmPassword"
        label="Confirm Password"
        censor
        v-model="confirmPassword"
      />

      <s-button class="w-full mt-10">Create Account</s-button>
      <s-button-text
        class="self-end mt-2"
        @click="$router.push({ name: 'Login' })"
      >
        Already have an account?
      </s-button-text>
    </form>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SInputPassword from "@/components/shared/Input/SInputPassword.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SButtonText from "@/components/shared/Button/SButtonText.vue";

export default defineComponent({
  name: "Login",
  components: {
    SGradientHeading,
    SInputText,
    SInputPassword,
    SButton,
    SButtonText,
  },
  setup() {
    const username = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    return {
      username,
      password,
      confirmPassword,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>