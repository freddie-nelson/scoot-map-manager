<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading :size="6" noscale>Register</s-gradient-heading>
    <form
      class="max-w-xl w-full px-4 mt-10 flex flex-col"
      @submit.prevent="registerAccount"
    >
      <s-input-text
        name="email"
        placeholder="johnsmith@example.com"
        label="Email"
        v-model="email"
      />
      <s-form-error v-if="email && !isEmailValid" class="mt-3"
        >Invalid email.</s-form-error
      >

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
      <s-form-error v-if="password && password.length < 6" class="mt-3"
        >Password must be at least 6 characters long.</s-form-error
      >
      <s-form-error v-else-if="password !== confirmPassword" class="mt-3"
        >Passwords do not match.</s-form-error
      >
      <s-form-error class="mt-3" v-if="error">{{ error }}</s-form-error>

      <s-button class="w-full mt-10" type="submit">Create Account</s-button>
      <s-button-text
        class="self-end mt-2"
        type="button"
        @click="$router.push({ name: 'Login' })"
      >
        Already have an account?
      </s-button-text>
    </form>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SInputPassword from "@/components/shared/Input/SInputPassword.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SButtonText from "@/components/shared/Button/SButtonText.vue";
import SFormError from "@/components/shared/Form/SFormError.vue";

export default defineComponent({
  name: "Register",
  components: {
    SGradientHeading,
    SInputText,
    SInputPassword,
    SButton,
    SButtonText,
    SFormError,
  },
  setup() {
    const auth = getAuth();

    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const error = ref("");

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = computed(() => emailRegex.test(email.value));

    // const usernameTaken = computed(() => {

    // })

    const registerAccount = async () => {
      if (
        password.value !== confirmPassword.value ||
        password.value.length < 6 ||
        !isEmailValid.value
      )
        return;

      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
      } catch (e) {
        error.value = e.message;
      }
    };

    return {
      email,
      password,
      confirmPassword,
      error,
      isEmailValid,
      registerAccount,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>