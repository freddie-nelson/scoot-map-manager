<template>
  <main class="flex flex-col overflow-y-scroll" style="padding-top: 0">
    <s-home-nav @download="download" />

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full px-20 my-auto">
      <div class="row-start-2 mx-auto mt-10 xl:row-auto xl:m-0">
        <h1
          class="
            content-title
            text-5xl
            font-semibold
            relative
            bg-primary
            w-auto
            mb-10
          "
        >
          Make SCOOT even better
        </h1>

        <div class="pt-8">
          <s-home-feature class="mb-6" :icon="icons.download">
            Download maps made by the community
          </s-home-feature>

          <s-home-feature class="mb-6" :icon="icons.upload">
            Upload your own creations
          </s-home-feature>

          <s-home-feature class="mb-6" :icon="icons.news">
            Keep up with the latest SCOOT news
          </s-home-feature>

          <s-home-feature :icon="icons.maps">
            Create, rename and delete your maps
          </s-home-feature>
        </div>

        <div class="mt-10 flex justify-between sm:block">
          <s-button-outline class="sm:mr-8" @click="openSupportPage"
            >Support SMM</s-button-outline
          >
          <s-button @click="download">Download</s-button>
        </div>
      </div>

      <img
        class="
          rounded-lg
          m-auto
          row-start-1
          w-full
          max-w-xl
          mt-8
          xl:mt-auto
          xl:row-auto
          xl:max-w-full
        "
        src="@web/assets/app-home.webp"
        alt=""
      />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import { getNewestRelease } from "../api/github";

import SHomeNav from "@web/components/app/Home/SHomeNav.vue";
import SHomeFeature from "@web/components/app/Home/SHomeFeature.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SButtonOutline from "@/components/shared/Button/SButtonOutline.vue";

import downloadIcon from "@iconify-icons/feather/save";
import uploadIcon from "@iconify-icons/feather/upload";
import newsIcon from "@iconify-icons/feather/trending-up";
import mapsIcon from "@iconify-icons/feather/map";

export default defineComponent({
  name: "Home",
  components: {
    SHomeNav,
    SHomeFeature,
    SButton,
    SButtonOutline,
  },
  setup() {
    const openSupportPage = () => {
      window.open("https://ko-fi.com/xdfreddie");
    };

    let version = "";
    const currentPlatform = navigator.platform.includes("Windows")
      ? "windows"
      : navigator.platform.includes("Mac")
      ? "mac"
      : "linux";
    const downloads = {
      windows: {},
      mac: {},
      linux: {},
    };

    const download = () => {
      const d = downloads[currentPlatform] as any;
      const a = document.createElement("a");
      a.href = d.browser_download_url;
      a.setAttribute("download", d.name);
      a.click();
    };

    onBeforeMount(async () => {
      const release = await getNewestRelease();
      if (!release) return;

      version = release.tag_name.slice(1);

      downloads.windows = release.assets.filter((a: any) =>
        a.name.endsWith("msi")
      )[0];
      downloads.mac = release.assets.filter((a: any) =>
        a.name.endsWith("dmg")
      )[0];
      downloads.linux = release.assets.filter((a: any) =>
        a.name.endsWith("deb")
      )[0];
    });

    return {
      openSupportPage,
      version,
      currentPlatform,
      downloads,
      download,
      icons: {
        download: downloadIcon,
        upload: uploadIcon,
        news: newsIcon,
        maps: mapsIcon,
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.content-title::after {
  content: "";
  position: absolute;
  bottom: -2.2rem;
  left: 0;
  width: 8.5ch;
  height: 0.7rem;
  background-color: rgba(6, 182, 212, var(--tw-bg-opacity));
  border-radius: 1rem;
}
</style>