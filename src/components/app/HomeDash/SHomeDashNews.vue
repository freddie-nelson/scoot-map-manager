<template>
  <s-dashboard-card class="flex flex-col">
    <s-home-dash-title>News</s-home-dash-title>

    <div v-if="isLoading" class="m-auto flex flex-col items-center w-full">
      <s-gradient-heading :size="4"> Loading News... </s-gradient-heading>
      <s-spinner-bar class="h-5 mt-4 w-full max-w-xl px-16 mx-auto" />
    </div>

    <div
      v-else-if="news.length > 0"
      class="mt-3 flex-grow grid grid-cols-1 grid-rows-2 gap-4"
    >
      <article
        v-for="(article, i) in news"
        :key="i"
        class="flex bg-input-blur w-full h-full rounded-md p-4"
      >
        <img
          class="
            rounded-md
            h-full
            w-auto
            bg-input-focus
            relative
            pointer-events-none
            select-none
            bg-no-repeat bg-center bg-cover bg-gradient-radial
            hidden
            xl:block
          "
          style="
            max-width: 15rem;
            box-shadow: inset 0 0 8rem 0 rgba(0, 0, 0, 0.5);
          "
          :style="{ backgroundImage: `url(${article.image})` }"
          src="data:image/svg+xml;utf8,&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'&gt;&lt;/svg&gt;"
        />

        <div class="xl:ml-4 flex flex-col">
          <h1 class="text-xl font-semibold">
            {{ article.title || "Article Title" }}
          </h1>

          <p
            class="
              mt-1.5
              opacity-70
              text-sm
              font-medium
              overflow-hidden overflow-ellipsis
            "
            style="
              display: -webkit-box;
              -webkit-line-clamp: 5;
              -webkit-box-orient: vertical;
            "
          >
            {{ article.body || "Article has no body." }}
          </p>

          <s-button-text
            v-if="article.url"
            @click="openArticle(article.url)"
            class="self-end mt-auto text-lg"
          >
            See More
          </s-button-text>
        </div>
      </article>
    </div>

    <h1 v-else class="m-auto text-center text-2xl font-semibold opacity-60">
      No news right now, check back later.
    </h1>
  </s-dashboard-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { open } from "@tauri-apps/api/shell";
import { collection, getDocs, getFirestore, query } from "@firebase/firestore";

import SDashboardCard from "@/components/app/Dashboard/SDashboardCard.vue";
import SHomeDashTitle from "./SHomeDashTitle.vue";
import SButtonText from "@/components/shared/Button/SButtonText.vue";
import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "SHomeDashNews",
  components: {
    SDashboardCard,
    SHomeDashTitle,
    SButtonText,
    SGradientHeading,
    SSpinnerBar,
  },
  setup() {
    const db = getFirestore();
    const newsRef = collection(db, "news");
    const q = query(newsRef);

    const news = ref<any[]>([]);
    const isLoading = ref(false);

    const fetchNews = async () => {
      isLoading.value = true;

      // get names of featured maps
      try {
        const docs = await getDocs(q);
        if (docs.empty) throw new Error("No articles.");

        news.value = docs.docs.map((d) => {
          const data = d.data();

          return {
            title: data.title,
            body: data.body,
            image: data.image,
            url: data.url,
          };
        });
      } catch (error) {
        console.log(error);
        isLoading.value = false;
        return;
      }

      isLoading.value = false;
    };

    onMounted(fetchNews);

    const openArticle = async (url: string) => {
      try {
        await open(url);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    return {
      news,
      isLoading,

      openArticle,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>