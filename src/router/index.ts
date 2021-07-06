import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import Maps from "@/views/Maps.vue";
import Installed from "@/views/Installed/Installed.vue";
import InstalledRoot from "@/views/Installed/Root.vue";
import InstalledUploaded from "@/views/Installed/Uploaded.vue";
import Profile from "@/views/Profile.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Setup from "@/views/Setup.vue";
import Upload from "@/views/Upload.vue";

import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/maps",
    name: "Maps",
    component: Maps,
  },
  {
    path: "/installed",
    component: Installed,
    children: [
      {
        path: "",
        name: "Installed",
        component: InstalledRoot,
      },
      {
        path: "uploaded",
        name: "InstalledUploaded",
        component: InstalledUploaded,
      },
    ],
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/setup",
    name: "Setup",
    component: Setup,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((g) => {
  const name = g.name?.toString();
  if (!name) return;

  if (name.match(/(Profile|Upload)/) && !store.state.user) router.push({ name: "Login" });

  if (!store.state.gameDir.base && name !== "Setup") {
    console.log(store.state.gameDir);
    router.push({ name: "Setup" });
  }
});

export default router;
