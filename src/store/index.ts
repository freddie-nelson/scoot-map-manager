import { FirebaseApp } from "@firebase/app";
import { User } from "firebase/auth";
import { createStore, useStore as vuexUseStore } from "vuex";
export interface Toast {
  text: string;
  duration?: number;
}

export interface Map {
  image: string;
  name: string;
  filename: string;
  creator: string;
}

export interface State {
  toastQueue: Toast[];
  user?: User;
  installedMaps: Map[];
}

const store = createStore<State>({
  state: {
    toastQueue: [],
    installedMaps: [],
  },
  mutations: {
    REMOVE_TOAST(state: any) {
      state.toastQueue.shift();
    },
    ADD_TOAST(state, toast: Toast) {
      state.toastQueue.push(toast);
    },

    SET_USER(state, user: User) {
      state.user = user;
    },
  },
  actions: {},
  getters: {},
});

export const useStore = () => {
  return vuexUseStore<State>();
};

export default store;
