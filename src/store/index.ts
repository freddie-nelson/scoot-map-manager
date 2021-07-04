import { Order } from "@/hooks/useUserMaps";
import { DocumentData, Query } from "@firebase/firestore";
import { User } from "firebase/auth";
import pathParse from "path-parse";
import { createStore, useStore as vuexUseStore } from "vuex";
export interface Toast {
  text: string;
  duration?: number;
}

export interface Map {
  name: string;
  creator: string;
  parkFile: string;
  image: string;
  imageEscaped?: string;
  downloads?: number;
  docId?: string;
}

export type ParsedPath = ReturnType<typeof pathParse>;

export interface QueryInfo {
  [index: string]: any;
  order: Order;
  limit: number;
  time: number;
  last?: DocumentData;
  first?: DocumentData;
}
export interface State {
  toastQueue: Toast[];
  user?: User;
  gameDir: ParsedPath;
  mapsDir: ParsedPath;
  installedMaps: Map[];
  isLoadingInstalled: boolean;
  lastLoadedMaps: number;
  globalMapsOrder?: Order;
  globalMapsOrderName?: string;
  lastQuery?: QueryInfo;
  uploadedMaps: Map[];
  refreshUploaded: boolean;
}

const gameDirStr = window.localStorage.getItem("gameDir");
const gameDir: ParsedPath = gameDirStr ? JSON.parse(gameDirStr) : pathParse("/");

const store = createStore<State>({
  state: {
    toastQueue: [],
    gameDir: gameDir,
    mapsDir: gameDir,
    installedMaps: [],
    isLoadingInstalled: false,
    lastLoadedMaps: 0,
    uploadedMaps: [],
    refreshUploaded: true,
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
      state.gameDir = dir;
      window.localStorage.setItem("gameDir", JSON.stringify(dir));

      state.mapsDir = pathParse(`${dir.dir}/${dir.base}/Scoot_Data/StreamingAssets/Map Saves/`);
    },

    SET_INSTALLED_MAPS(state, maps: Map[]) {
      state.installedMaps = maps;
    },
    ADD_INSTALLED_MAP(state, map: Map) {
      state.installedMaps.push(map);
    },
    ADD_MAP_IMAGE(state, { i, url }: { i: number; url: string }) {
      if (state.installedMaps[i]) state.installedMaps[i].image = url;
    },
    REMOVE_INSTALLED_MAP(state, index: number) {
      state.installedMaps.splice(index, 1);
    },

    SET_LOADING_INSTALLED(state, b: boolean) {
      state.isLoadingInstalled = b;
    },
    SET_LAST_LOADED(state, time: number) {
      state.lastLoadedMaps = time;
    },

    SET_GLOBAL_MAPS_ORDER(state, { order, name }: { order: Order; name: string }) {
      state.globalMapsOrder = order;
      state.globalMapsOrderName = name;
    },

    SET_LAST_QUERY(state, query: QueryInfo) {
      state.lastQuery = query;
    },

    SET_UPLOADED_MAPS(state, maps: Map[]) {
      state.uploadedMaps = maps;
    },
    SET_REFRESH_UPLOADED(state, b: boolean) {
      state.refreshUploaded = b;
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
