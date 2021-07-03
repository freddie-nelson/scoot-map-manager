import { Ref, ref } from "vue";
import store, { Map } from "@/store";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QuerySnapshot,
  DocumentData,
  Query,
  endBefore,
  endAt,
  increment,
  doc,
  updateDoc,
  DocumentReference,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { createDir, writeBinaryFile } from "@tauri-apps/api/fs";
import { buildInputFile, Call } from "wasm-imagemagick";

export default function (maps: Ref<Map[]>, startPage = 0, mapsPerPage = 25) {
  const storage = getStorage();

  const db = getFirestore();
  const mapsRef = collection(db, "maps");

  const pageNum = ref(startPage);
  const perPage = ref(mapsPerPage);

  const isLoading = ref(false);

  const addDocsToMaps = (docs: DocumentData[]) => {
    maps.value = [];

    docs.forEach((doc) => {
      const data = doc.data();

      const map: Map = {
        name: data.name,
        creator: data.creator,
        image: data.image,
        imageEscaped: data.image.replace(/'|"|`|\(|\)|\[|\]/g, "\\$&"),
        parkFile: data.parkFile,
        downloads: data.downloads || 0,
      };

      maps.value.push(map);
    });
  };

  const firstVisible = ref<DocumentData | undefined>();
  const lastVisible = ref<DocumentData | undefined>();

  const setDocBoundaries = (docs: DocumentData[]) => {
    if (docs.length === 0) return;

    firstVisible.value = docs[0];
    lastVisible.value = docs[docs.length - 1];
  };

  const fetchNextMaps = async () => {
    let q: Query<DocumentData>;
    if (!lastVisible.value) {
      q = query(mapsRef, orderBy("created_at", "desc"), limit(perPage.value));
    } else {
      q = query(mapsRef, orderBy("created_at", "desc"), startAfter(lastVisible.value), limit(perPage.value));
    }

    let docs: QuerySnapshot<DocumentData>;
    try {
      docs = await getDocs(q);
    } catch (error) {
      console.log(error);
      return;
    }

    setDocBoundaries(docs.docs);
    addDocsToMaps(docs.docs);
  };

  const fetchPreviousMaps = async () => {
    let q: Query<DocumentData>;
    if (maps.value.length === 0) {
      q = query(mapsRef, orderBy("created_at", "desc"), endAt(lastVisible.value), limit(perPage.value));
    } else {
      q = query(mapsRef, orderBy("created_at", "desc"), endBefore(firstVisible.value), limit(perPage.value));
    }

    let docs: QuerySnapshot<DocumentData>;
    try {
      docs = await getDocs(q);
    } catch (error) {
      console.log(error);
      return;
    }

    setDocBoundaries(docs.docs);
    addDocsToMaps(docs.docs);
  };

  const nextPage = async () => {
    if (maps.value.length === 0 && pageNum.value !== 0) return;

    pageNum.value++;
    isLoading.value = true;

    await fetchNextMaps();

    isLoading.value = false;
  };

  const previousPage = async () => {
    if (pageNum.value === 1) return;

    pageNum.value--;
    isLoading.value = true;

    await fetchPreviousMaps();

    isLoading.value = false;
  };

  const fetchAndSaveMap = async (map: Map) => {
    let image: ArrayBuffer;
    try {
      const outputFiles = await Call(
        [await buildInputFile(map.image, "image.jpg")],
        ["convert", "image.jpg", "-resize", "1200x1200", "image.png"]
      );

      if (!outputFiles[0]) throw new Error("Failed to convert image to png.");

      image = await outputFiles[0].blob.arrayBuffer();
    } catch (error) {
      console.log(error);
      return;
    }

    let parkFile: ArrayBuffer;
    try {
      parkFile = await fetch(map.parkFile).then((res) => res.arrayBuffer());
    } catch (error) {
      console.log(error);
      return;
    }

    const mapDir = `${store.state.mapsDir.dir}/${map.name}`;

    try {
      await createDir(mapDir, { recursive: true });
      await writeBinaryFile({
        contents: image,
        path: `${mapDir}/ParkCapture.png`,
      });
      await writeBinaryFile({
        contents: parkFile,
        path: `${mapDir}/ObjectInfo.ScootPark`,
      });
    } catch (error) {
      console.log(error);
      return;
    }

    console.log("saved map");
  };

  const incrementDownloadsCounter = async (map: Map) => {
    // get map doc reference
    let mapRef: DocumentReference<DocumentData>;
    try {
      mapRef = await doc(db, "maps", map.name);
    } catch (error) {
      console.log(error);
      return;
    }

    // update downloads
    try {
      await updateDoc(mapRef, {
        downloads: increment(1),
      });
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const isDownloading = ref(false);
  const downloadMap = async (map: Map) => {
    isDownloading.value = true;

    await fetchAndSaveMap(map);
    await incrementDownloadsCounter(map);

    isDownloading.value = false;
  };

  let lastSearchTerm = "";
  let lastSearchTime = 0;
  let recentSearchCount = 0;

  const search = async (searchTerm: string) => {
    // rate limit search client side
    if (Date.now() - lastSearchTime < 3000) {
      return;
    } else if (Date.now() - lastSearchTime < 30000) {
      recentSearchCount++;

      if (recentSearchCount >= 5) {
        // TODO implement toast warnings
        return;
      }
    } else {
      recentSearchCount = 0;
    }

    // early exits
    if (searchTerm === "" && recentSearchCount < 5) {
      pageNum.value = 0;
      maps.value.length = 0;
      lastVisible.value = undefined;
      firstVisible.value = undefined;

      lastSearchTime = Date.now();

      return nextPage();
    } else if (searchTerm === lastSearchTerm) return;

    let q: Query;
    if (searchTerm.startsWith("creatorId:")) {
      q = query(mapsRef, where("creatorId", "==", searchTerm.substring("creatorId:".length)));
    } else {
      q = query(
        mapsRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff") // uf8ff is super high value unicode char so everything that starts with searchTerm is found
      );
    }

    isLoading.value = true;

    const docs = await getDocs(q);

    setDocBoundaries(docs.docs);
    addDocsToMaps(docs.docs);

    lastSearchTerm = searchTerm;
    lastSearchTime = Date.now();
    isLoading.value = false;
  };

  const deleteMap = async (map: Map) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, "maps", map.name)),
        deleteObject(storageRef(storage, `captures/${map.name}.jpg`)),
        deleteObject(storageRef(storage, `parkfiles/${map.name}.ScootPark`)),
      ]);
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  };

  return {
    isLoading,
    nextPage,
    previousPage,

    isDownloading,
    downloadMap,

    search,

    deleteMap,

    pageNum,
  };
}
