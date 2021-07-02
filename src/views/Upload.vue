<template>
  <main class="flex flex-col justify-center items-center">
    <s-gradient-heading class="text-center" :size="5" noscale>
      {{ !isUploading ? "Upload Map" : "Uploading..." }}
    </s-gradient-heading>

    <form
      v-if="!isUploading"
      class="flex flex-col max-w-xl w-full px-4 mt-8"
      @submit.prevent="uploadMap"
    >
      <s-input-text
        v-model="map.name"
        name="mapName"
        placeholder="My Epic Map"
        label="Map Name"
      />
      <s-form-error v-if="isNameTaken" class="mt-2"
        >That name is already taken.</s-form-error
      >
      <s-form-error v-if="uploadFailed" class="mt-2"
        >An error occurred while uploading.</s-form-error
      >

      <s-button class="mt-5" type="submit">Upload</s-button>
    </form>

    <s-spinner-bar v-else class="h-5 max-w-xl w-full px-4 mt-8" />
  </main>
</template>

<script lang="ts">
import { Map, useStore } from "@/store";
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { buildInputFile, Call } from "wasm-imagemagick";

import { readTextFile } from "@tauri-apps/api/fs";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  DocumentData,
  serverTimestamp,
  DocumentReference,
  deleteDoc,
} from "@firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  StorageReference,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";

import SGradientHeading from "@/components/shared/Heading/SGradientHeading.vue";
import SInputText from "@/components/shared/Input/SInputText.vue";
import SButton from "@/components/shared/Button/SButton.vue";
import SFormError from "@/components/shared/Form/SFormError.vue";
import SSpinnerBar from "@/components/shared/Spinner/SSpinnerBar.vue";

export default defineComponent({
  name: "Profile",
  components: {
    SGradientHeading,
    SInputText,
    SButton,
    SFormError,
    SSpinnerBar,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const db = getFirestore();

    const storage = getStorage();
    const capturesRef = storageRef(storage, "captures");
    const parksRef = storageRef(storage, "parkfiles");

    const map = ref<Map>();

    onBeforeMount(() => {
      if (!store.state.user) return router.push({ name: "Register" });
      else if (store.state.installedMaps.length === 0)
        return router.push({ name: "Installed" });

      const index = Number(router.currentRoute.value.params.mapIndex);
      if (
        isNaN(index) ||
        index < 0 ||
        index >= store.state.installedMaps.length
      )
        return router.push({ name: "Installed" });

      map.value = { ...store.state.installedMaps[index] };
    });

    const isNameTaken = ref(false);
    watch(
      computed(() => (map.value ? map.value.name : "")),
      (name, oldName) => {
        if (name !== oldName) isNameTaken.value = false;
      }
    );

    const isNameValid = async () => {
      if (!map.value || !map.value.name) return false;

      const docRef = doc(db, "maps", map.value.name);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        isNameTaken.value = true;
        return false;
      }

      return true;
    };

    const uploadFailed = ref(false);
    const isUploading = ref(false);

    const uploadMap = async () => {
      uploadFailed.value = false;
      if (!map.value || !store.state.user || !(await isNameValid())) return;
      isUploading.value = true;

      // read image in
      let image: Blob;
      try {
        // convert image to jpeg and compress
        const outputFiles = await Call(
          [await buildInputFile(map.value.image, "image.png")],
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

        image = outputFiles[0].blob.slice(
          0,
          outputFiles[0].blob.size,
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        uploadFailed.value = true;
        isUploading.value = false;
        return;
      }

      // read park file as binary
      let parkJSON: string;
      try {
        parkJSON = JSON.stringify(
          JSON.parse(await readTextFile(map.value.parkFile))
        );
      } catch (error) {
        console.log(error);
        uploadFailed.value = true;
        isUploading.value = false;
        return;
      }

      const parkFile = new Blob([parkJSON], { type: "application/json" });

      // upload files to cloud storage
      let imageRef: StorageReference | undefined;
      let parkRef: StorageReference | undefined;
      try {
        imageRef = storageRef(capturesRef, `${map.value.name}.jpg`);
        await uploadBytes(imageRef, image);

        parkRef = storageRef(parksRef, `${map.value.name}.ScootPark`);
        await uploadBytes(parkRef, parkFile);
      } catch (error) {
        console.log(error);

        await cleanupUploadFail([imageRef, parkRef]);

        uploadFailed.value = true;
        isUploading.value = false;
        return;
      }

      // save map to firestore
      const docData: DocumentData = {
        name: map.value.name,
        creator:
          store.state.user.displayName ||
          store.state.user.email?.split("@")[0] ||
          "Joe",
        creatorId: store.state.user.uid,
        image: await getDownloadURL(imageRef),
        parkFile: await getDownloadURL(parkRef),
        created_at: serverTimestamp(),
      };

      try {
        await setDoc(doc(db, "maps", map.value.name), docData);
      } catch (error) {
        console.log(error);

        await cleanupUploadFail(
          [imageRef, parkRef],
          doc(db, "maps", map.value.name)
        );

        uploadFailed.value = true;
        isUploading.value = false;
        return;
      }

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
      map,
      isNameTaken,
      uploadFailed,
      isUploading,
      uploadMap,
    };
  },
});
</script>

<style lang="scss" scoped></style>
