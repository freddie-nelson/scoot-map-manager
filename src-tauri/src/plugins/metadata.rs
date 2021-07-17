use std::fs;
use std::time::UNIX_EPOCH;
use tauri::Runtime;
use tauri::{plugin::Plugin, Invoke};

pub struct Metadata<M: Runtime> {
  invoke_handler: Box<dyn Fn(Invoke<M>) + Send + Sync>,
  // plugin state, configuration fields
}

#[tauri::command]
// this will be accessible with `invoke('plugin:metadata|get_last_modified')`.
fn get_last_modified(file: String) -> Result<u64, u64> {
  if let Ok(metadata) = fs::metadata(file) {
    if let Ok(time) = metadata.modified() {
      let since_the_epoch = time
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards");

      let in_ms =
        since_the_epoch.as_secs() * 1000 + since_the_epoch.subsec_nanos() as u64 / 1_000_000;
      return Ok(in_ms);
    } else {
      return Err(0);
    }
  } else {
    return Err(0);
  }
}

impl<M: Runtime> Default for Metadata<M> {
  // you can add configuration fields here,
  // see https://doc.rust-lang.org/1.0.0/style/ownership/builders.html
  fn default() -> Self {
    Self {
      invoke_handler: Box::new(tauri::generate_handler![get_last_modified]),
    }
  }
}

impl<M: Runtime> Plugin<M> for Metadata<M> {
  /// The plugin name. Must be defined and used on the `invoke` calls.
  fn name(&self) -> &'static str {
    "metadata"
  }

  fn extend_api(&mut self, invoke: Invoke<M>) {
    (self.invoke_handler)(invoke)
  }
}
