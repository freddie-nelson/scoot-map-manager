import { User } from "firebase/auth";
import pathParse from "path-parse";
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

export type ParsedPath = ReturnType<typeof pathParse>;

export interface State {
  toastQueue: Toast[];
  user?: User;
  installedMaps: Map[];
  gameDir: ParsedPath;
  mapsDir: ParsedPath;
}

const gameDirStr = window.localStorage.getItem("gameDir");
const gameDir: ParsedPath = gameDirStr ? JSON.parse(gameDirStr) : pathParse("/");

const store = createStore<State>({
  state: {
    toastQueue: [],
    installedMaps: [],
    gameDir: gameDir,
    mapsDir: gameDir,
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

    SET_GAME_DIR(state, dir: ParsedPath) {
      dir.dir += "/SCOOT";
      state.gameDir = dir;
      window.localStorage.setItem("gameDir", JSON.stringify(dir));

      const mapsDir: ParsedPath = { ...state.gameDir };
      mapsDir.dir += "/Scoot_Data/StreamingAssets/Map Saves";
      state.mapsDir = mapsDir;
    },
  },
  actions: {},
  getters: {},
});

store.commit("SET_GAME_DIR", gameDir);

export const useStore = () => {
  return vuexUseStore<State>();
};

export default store;
