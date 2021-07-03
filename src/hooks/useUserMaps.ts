import { Ref, ref, watch } from "vue";
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
  OrderByDirection,
} from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { createDir, writeBinaryFile } from "@tauri-apps/api/fs";
import { buildInputFile, Call } from "wasm-imagemagick";

export interface Order {
  field: string;
  dir: OrderByDirection;
}

const defaultOrder: Order = {
  field: "created_at",
  dir: "desc",
};

export default function (maps: Ref<Map[]>, startOrder = defaultOrder, startPage = 0, mapsPerPage = 25) {
  const storage = getStorage();

  const db = getFirestore();
  const mapsRef = collection(db, "maps");

  const pageNum = ref(startPage);
  const perPage = ref(mapsPerPage);

  const isLoading = ref(false);
  const order = ref(orderBy(startOrder.field, startOrder.dir));

  const resetMaps = () => {
    disablePageChange = false;
    pageNum.value = 0;
    maps.value.length = 0;
    lastVisible.value = undefined;
    firstVisible.value = undefined;

    nextPage();
  };

  watch(order, resetMaps);

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
      q = query(mapsRef, order.value, limit(perPage.value));
    } else {
      q = query(mapsRef, order.value, startAfter(lastVisible.value), limit(perPage.value));
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
      q = query(mapsRef, order.value, endAt(lastVisible.value), limit(perPage.value));
    } else {
      q = query(mapsRef, order.value, endBefore(firstVisible.value), limit(perPage.value));
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

  let disablePageChange = false;
  const nextPage = async () => {
    if ((maps.value.length === 0 && pageNum.value !== 0) || disablePageChange) return;

    pageNum.value++;
    isLoading.value = true;

    await fetchNextMaps();

    isLoading.value = false;
  };

  const previousPage = async () => {
    if (pageNum.value === 1 || disablePageChange) return;

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
    if (!searchTerm) {
      if (recentSearchCount < 5 && searchTerm !== lastSearchTerm) {
        lastSearchTime = Date.now();
        lastSearchTerm = searchTerm;

        resetMaps();
      }

      return;
    } else if (searchTerm === lastSearchTerm) return;

    disablePageChange = true;
    pageNum.value = 1;

    let q: Query;
    if (searchTerm.startsWith("creatorId:")) {
      q = query(mapsRef, where("creatorId", "==", searchTerm.substring("creatorId:".length)));
    } else {
      q = query(
        mapsRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"), // uf8ff is super high value unicode char so everything that starts with searchTerm is found
        limit(10)
      );
    }

    isLoading.value = true;

    try {
      const docs = await getDocs(q);
      addDocsToMaps(docs.docs);
    } catch (error) {
      console.log(error);
      return;
    }

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
    order,

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
