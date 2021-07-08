<template>
  <section class="flex">
    <div
      class="
        flex
        justify-center
        items-center
        rounded-xl
        w-64
        h-64
        bg-input-focus
        mr-12
      "
    >
      <Icon class="w-24 h-24 text-bg-dark" :icon="icons.user" />
    </div>

    <div class="flex flex-col justify-center">
      <s-input-text
        class="text-lg max-w-lg"
        style="min-width: 20rem; width: 60vw"
        v-model="displayName"
        name="displayName"
        label="Display Name"
        placeholder="johnsmith16"
      />

      <s-button class="mt-4" @click="changeName">{{
        changing ? "Changing name..." : "Change Name"
      }}</s-button>

      <s-form-error v-if="changeError" class="mt-4"
        >There was an error changing your display name.</s-form-error
      >
      <s-form-success v-if="changeSuccess" class="mt-4"
        >Successfully updated your display name.</s-form-success
      >
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "@/store";
import { getAuth, updateProfile } from "@firebase/auth";

import SInputText from "@/components/shared/Input/SInputText.vue";
import SFormError from "@/components/shared/Form/SFormError.vue";
import SFormSuccess from "@/components/shared/Form/SFormSuccess.vue";
import SButton from "@/components/shared/Button/SButton.vue";

import { Icon } from "@iconify/vue";
import userIcon from "@iconify-icons/feather/user";

export default defineComponent({
  name: "SProfileInfo",
  components: {
    SInputText,
    Icon,
    SButton,
    SFormError,
    SFormSuccess,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const auth = getAuth();

    let currentDisplayName =
      store.state.user?.displayName ||
      store.state.user?.email?.split("@")[0] ||
      "";
    const displayName = ref(currentDisplayName);

    const changing = ref(false);
    const changeError = ref(false);
    const changeSuccess = ref(false);
    const changeName = async () => {
      changeError.value = false;
      changeSuccess.value = false;

      if (changing.value || displayName.value === currentDisplayName) return;

      changing.value = true;

      try {
        if (!auth.currentUser) return;
        await updateProfile(auth.currentUser, {
          displayName: displayName.value,
        });

        currentDisplayName = displayName.value;
        changeSuccess.value = true;
      } catch (error) {
        console.log(error);
        changeError.value = true;
        return;
      } finally {
        changing.value = false;
      }
    };

    return {
      displayName,
      changing,
      changeName,
      changeError,
      changeSuccess,
      icons: {
        user: userIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
