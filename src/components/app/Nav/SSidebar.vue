<template>
  <nav
    class="
      pr-24
      bg-red-500
      h-full
      text-white
      flex flex-col
      justify-between
      items-center
    "
  >
    <router-link
      class="block hover:text-yellow-400 transition-colors duration-300"
      :class="{ 'text-yellow-400': $route.name === 'Home' }"
      to="/"
    >
      <Icon class="w-full h-full" :icon="icons.home" />
    </router-link>
    <router-link
      class="block hover:text-yellow-400 transition-colors duration-300"
      :class="{ 'text-yellow-400': $route.name === 'Maps' }"
      to="/maps"
    >
      <Icon class="w-full h-full" :icon="icons.map" />
    </router-link>
    <router-link
      class="block hover:text-yellow-400 transition-colors duration-300"
      :class="{ 'text-yellow-400': $route.name === 'Installed' }"
      to="/installed"
    >
      <Icon class="w-full h-full" :icon="icons.folder" />
    </router-link>
    <router-link
      class="block hover:text-yellow-400 transition-colors duration-300"
      :class="{ 'text-yellow-400': $route.name === 'Profile' }"
      to="/profile"
    >
      <Icon class="w-full h-full" :icon="icons.user" />
    </router-link>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Icon } from "@iconify/vue";
import homeIcon from "@iconify-icons/feather/home";
import folderIcon from "@iconify-icons/feather/folder";
import mapIcon from "@iconify-icons/feather/map";
import userIcon from "@iconify-icons/feather/user";

export default defineComponent({
  name: "SSidebar",
  components: {
    Icon,
  },
  setup() {
    return {
      icons: {
        home: homeIcon,
        folder: folderIcon,
        map: mapIcon,
        user: userIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
nav {
  padding-top: 28vh;
  padding-bottom: 28vh;
  min-width: 10.5rem;
  width: 12vw;
  max-width: 12rem;

  a {
    width: 40%;
  }
}
</style>
