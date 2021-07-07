import { Map, useStore } from "@/store";
import { useRouter } from "vue-router";
import { FileEntry, readDir, removeDir, readBinaryFile } from "@tauri-apps/api/fs";
import { getLastModified } from "@/plugins/Metadata";
import path from "path-browserify";

export default function () {
  const store = useStore();
  const router = useRouter();
  const mapsDir = store.state.mapsDir;

  const readAndParseMaps = async (force = false) => {
    let folders: FileEntry[];
    try {
      folders = await readDir(mapsDir);
    } catch (error) {
      console.log(error);
      return;
    }

    // only proceed if a map has been modified since last load
    if (!force && folders.length === store.state.installedMaps.length) {
      let mostRecent = 0;

      for (const folder of folders) {
        try {
          const time = await getLastModified(folder.path);
          if (!time) return;

          if (time > mostRecent) {
            mostRecent = time;
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }

      if (mostRecent < store.state.lastLoadedMaps) {
        return;
      }
    }

    store.commit("SET_INSTALLED_MAPS", []);

    let i = 0;
    for (const folder of folders) {
      i++;
      if (!folder.children) return;

      // find map files
      const files = await readDir(folder.path);

      const parkFile = files.find((f) => f.name === "ObjectInfo.ScootPark");
      if (!parkFile) return;

      const previewImage = files.find((f) => f.name === "ParkCapture.png");
      if (!previewImage) return;

      // add map to maps
      store.commit("ADD_INSTALLED_MAP", {
        name: folder.name || `Map ${i}`,
        creator: "You",
        image: "",
        parkFile: parkFile.path,
      });

      loadImage(previewImage, i - 1);
    }

    store.commit("SET_LAST_LOADED", Date.now());
  };

  const loadImage = async (image: FileEntry, i: number) => {
    let byteArr: Uint8Array;

    try {
      byteArr = new Uint8Array(await readBinaryFile(image.path));
    } catch (error) {
      console.log(error);
      return;
    }

    const blob = new Blob([byteArr], { type: "image/png" });

    store.commit("ADD_MAP_IMAGE", { i, url: URL.createObjectURL(blob) });
  };

  const deleteMap = async (map: Map) => {
    const p = path.normalize(map.parkFile);
    const i = store.state.installedMaps.findIndex((m) => m === map);

    try {
      await removeDir(p, { recursive: true });
      store.commit("REMOVE_INSTALLED_MAP", i);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  };

  const uploadMap = (i: number) => {
    router.push({ name: "Upload", params: { mapIndex: i } });
  };

  return {
    readAndParseMaps,
    deleteMap,
    uploadMap,
  };
}
