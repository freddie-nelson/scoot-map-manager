#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod plugins;

fn main() {
  let metadata = plugins::Metadata::default();

  tauri::Builder::default()
    .plugin(metadata)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
