/* eslint-disable */

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "image-blob-reduce" {
  export default class ImageBlobReduce {
    constructor() {}

    toBlob(b: Blob, maxSize: number): Blob;
  }
}
