<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading class="text-center" :size="5">
      Select SCOOT Directory
    </s-gradient-heading>

    <div class="flex mt-8">
      <s-input-text
        class="max-w-md min-w-max"
        style="width: 40vw"
        placeholder="Enter directory..."
        name="Game Directory"
        v-model="gameDir"
      />
      <s-button class="ml-3" style="height: 100%" @click="openDialog">
        Browse
      </s-button>
    </div>

    <s-button class="mt-8 w-44" @click="submitDir"> Done </s-button>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { dialog, fs, path } from "@tauri-apps/api";
import pathParse from "path-parse";

import SInputText from "@/components/shared/Input/SInputText.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Setup",
  components: {
    SInputText,
    SButton,
    SGradientHeading,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    let homeDir: string;
    onMounted(async () => {
      homeDir = await path.homeDir();
    });

    const gameDir = ref(store.state.gameDir.dir);

    const openDialog = async () => {
      let dir = await dialog.open({
        defaultPath: gameDir.value || homeDir,
        directory: true,
        multiple: false,
      });

      if (Array.isArray(dir)) {
        dir = dir[0];
      }

      gameDir.value = dir;
    };

    const submitDir = async () => {
      try {
        const res = await fs.readDir(gameDir.value);
        if (res.length === 0) return;

        store.commit("SET_GAME_DIR", pathParse(gameDir.value));
        router.push({ name: "Installed" });
      } catch (e) {
        return;
      }
    };

    return {
      gameDir,
      openDialog,
      submitDir,
    };
  },
});
</script>

<style lang="scss" scoped></style>
