const fs = require("fs");
const path = "./node_modules/@tauri-apps/api/window.ts";

let data = fs.readFileSync(path, "utf-8");
data = "// @ts-nocheck \n" + data;

fs.writeFileSync(path, data);
