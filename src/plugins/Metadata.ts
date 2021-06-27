import { invoke } from "@tauri-apps/api/tauri";

export function getLastModified(file: string): Promise<number> {
  return invoke("plugin:metadata|get_last_modified", {
    file,
  });
}
