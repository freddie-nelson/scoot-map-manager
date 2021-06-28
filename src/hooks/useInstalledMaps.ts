import { useStore } from "@/store";
import { useRouter } from "vue-router";
import { FileEntry, readDir, removeDir, readBinaryFile } from "@tauri-apps/api/fs";
import { getLastModified } from "@/plugins/Metadata";
import pathParse from "path-parse";

export default function () {
  const store = useStore();
  const router = useRouter();
  const mapsDir = `${store.state.mapsDir.dir}/`;

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

      // read image as binary
      let byteArr: Uint8Array;

      try {
        byteArr = new Uint8Array(await readBinaryFile(previewImage.path));
      } catch (error) {
        console.log(error);
        return;
      }

      const blob = new Blob([byteArr], { type: "image/png" });

      // add map to maps
      store.commit("ADD_INSTALLED_MAP", {
        name: folder.name || `Map ${i}`,
        creator: "You",
        image: URL.createObjectURL(blob),
        parkFile: parkFile.path,
      });

      store.commit("SET_LAST_LOADED", Date.now());
    }
  };

  const deleteMap = async (i: number) => {
    const map = store.state.installedMaps[i];
    const path = pathParse(map.parkFile);

    store.commit("REMOVE_INSTALLED_MAP", i);

    try {
      await removeDir(path.dir, { recursive: true });
    } catch (error) {
      return;
    }
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