import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// import tailwind
import "../src/assets/tailwind.css";

// import fonts
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/600.css";

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
