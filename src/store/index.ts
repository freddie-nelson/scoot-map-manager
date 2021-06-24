import { FirebaseApp } from "@firebase/app";
import { createStore, useStore as vuexUseStore } from "vuex";
export interface Toast {
  text: string;
  duration?: number;
}
export interface State {
  toastQueue: Toast[];
  firebase: FirebaseApp;
}

const store = createStore<State>({
  state: {
    toastQueue: [],
    // @ts-ignore
    firebase: null,
  },
  mutations: {
    REMOVE_TOAST(state: any) {
      state.toastQueue.shift();
    },
    ADD_TOAST(state, toast: Toast) {
      state.toastQueue.push(toast);
    },
  },
  actions: {},
  getters: {},
});

export const useStore = () => {
  return vuexUseStore<State>();
};

export default store;
