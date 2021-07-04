import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

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

// setup firebase
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5Byw4nqMC4U0Q9TY3c1W09wsJzXhIKP8",
  authDomain: "scoot-map-manager.firebaseapp.com",
  projectId: "scoot-map-manager",
  storageBucket: "scoot-map-manager.appspot.com",
  messagingSenderId: "119951491194",
  appId: "1:119951491194:web:e369153ea424175fc67bc3",
  measurementId: "G-8SEWBC1GRC",
};

initializeApp(firebaseConfig);

const db = getFirestore();
enableIndexedDbPersistence(db)
  .then(() => console.log("enabled indexed db persistence"))
  .catch((e) => console.log(e));

const auth = getAuth();
auth.setPersistence(browserLocalPersistence);

auth.onAuthStateChanged(() => {
  store.commit("SET_USER", auth.currentUser || undefined);

  if (auth.currentUser) {
    if (router.currentRoute.value.name?.toString().match(/(Login)|(Register)/))
      router.push({ name: "Profile" });
  } else router.push({ name: "Login" });
});

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
