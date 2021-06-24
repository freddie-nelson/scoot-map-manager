import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";

// setup firebase
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA5Byw4nqMC4U0Q9TY3c1W09wsJzXhIKP8",
  authDomain: "scoot-map-manager.firebaseapp.com",
  projectId: "scoot-map-manager",
  storageBucket: "scoot-map-manager.appspot.com",
  messagingSenderId: "119951491194",
  appId: "1:119951491194:web:e369153ea424175fc67bc3",
  measurementId: "G-8SEWBC1GRC",
};

const firebaseApp = initializeApp(firebaseConfig);
store.state.firebase = firebaseApp;

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
