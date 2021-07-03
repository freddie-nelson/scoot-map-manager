import { computed, Ref, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import store, { Map } from "@/store";
import router from "@/router";

import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  StorageReference,
  uploadBytes,
} from "@firebase/storage";
import { buildInputFile, Call } from "wasm-imagemagick";
import { readTextFile } from "@tauri-apps/api/fs";
import { User } from "@firebase/auth";

export default function (map: Ref<Map | undefined>) {
  const db = getFirestore();

  const storage = getStorage();
  const capturesRef = storageRef(storage, "captures");
  const parksRef = storageRef(storage, "parkfiles");

  const isNameTaken = ref(false);
  watch(
    computed(() => (map.value ? map.value.name : "")),
    (name, oldName) => {
      if (name !== oldName) isNameTaken.value = false;
    }
  );

  const isNameValid = async (name: string) => {
    if (!name || name.length < 3 || name.length > 30) return false;

    const docRef = doc(db, "maps", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      isNameTaken.value = true;
      return false;
    }

    return true;
  };

  const uploadFailed = ref(false);
  const isUploading = ref(false);

  const loadImage = async (url: string) => {
    let image: Blob;
    try {
      // convert image to jpeg and compress
      const outputFiles = await Call(
        [await buildInputFile(url, "image.png")],
        [
          "convert",
          "image.png",
          "-strip",
          "-interlace",
          "Plane",
          "-gaussian-blur",
          "0.05",
          "-quality",
          "70%",
          "-resize",
          "900x900",
          "result.jpg",
        ]
      );

      if (!outputFiles[0]) throw new Error("Failed to convert image to jpg");

      image = outputFiles[0].blob.slice(0, outputFiles[0].blob.size, "image/jpeg");
    } catch (error) {
      console.log(error);
      uploadFailed.value = true;
      isUploading.value = false;
      return;
    }

    return image;
  };

  const loadParkfile = async (path: string) => {
    try {
      const json = JSON.stringify(JSON.parse(await readTextFile(path)));
      return new Blob([json], { type: "application/json" });
    } catch (error) {
      console.log(error);
      uploadFailed.value = true;
      isUploading.value = false;
      return;
    }
  };

  const uploadImageAndParkFile = async (name: string, creatorId: string, image: Blob, parkFile: Blob) => {
    let imageRef: StorageReference | undefined;
    let parkRef: StorageReference | undefined;

    try {
      const metadata = {
        customMetadata: { creatorId },
      };

      imageRef = storageRef(capturesRef, `${name}.jpg`);
      await uploadBytes(imageRef, image, metadata);

      parkRef = storageRef(parksRef, `${name}.ScootPark`);
      await uploadBytes(parkRef, parkFile, metadata);
    } catch (error) {
      console.log(error);

      await cleanupUploadFail([imageRef, parkRef]);

      uploadFailed.value = true;
      isUploading.value = false;
      return;
    }

    return {
      imageRef,
      parkRef,
    };
  };

  const saveToDb = async (
    name: string,
    user: User,
    imageRef: StorageReference,
    parkRef: StorageReference
  ): Promise<boolean> => {
    const docData: DocumentData = {
      name: name,
      creator: user.displayName || user.email?.split("@")[0] || "Joe",
      creatorId: user.uid,
      image: await getDownloadURL(imageRef),
      parkFile: await getDownloadURL(parkRef),
      created_at: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "maps", name), docData);
    } catch (error) {
      console.log(error);

      await cleanupUploadFail([imageRef, parkRef], doc(db, "maps", name));

      uploadFailed.value = true;
      isUploading.value = false;
      return false;
    }

    return true;
  };

  const uploadMap = async (map: Map) => {
    uploadFailed.value = false;
    if (!map || !store.state.user || !(await isNameValid(map.name))) return;
    isUploading.value = true;

    // load and compress image
    const image = await loadImage(map.image);
    if (!image) return;

    // read park file as binary
    const parkFile = await loadParkfile(map.parkFile);
    if (!parkFile) return;

    // upload files to cloud storage
    const uploadRes = await uploadImageAndParkFile(map.name, store.state.user.uid, image, parkFile);
    if (!uploadRes) return;

    const { imageRef, parkRef } = uploadRes;

    // save map to firestore
    const success = await saveToDb(map.name, store.state.user, imageRef, parkRef);
    if (!success) return;

    isUploading.value = false;
    router.push({ name: "Installed" });
  };

  const cleanupUploadFail = async (
    files: (StorageReference | undefined)[],
    doc?: DocumentReference<DocumentData>
  ) => {
    for (const file of files) {
      if (!file) continue;

      try {
        await deleteObject(file);
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    if (!doc) return;

    try {
      await deleteDoc(doc);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  onBeforeRouteLeave(() => {
    if (isUploading.value) return false;
  });

  return {
    isNameTaken,
    uploadFailed,
    isUploading,
    loadImage,
    loadParkfile,
    uploadImageAndParkFile,
    saveToDb,
    uploadMap,
    cleanupUploadFail,
  };
}
