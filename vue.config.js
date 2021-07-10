const path = require("path");

const isMainApp = process.env.APP_TYPE === "main";
const appDir = isMainApp ? "src" : "web";

module.exports = {
  outputDir: !isMainApp ? path.resolve(__dirname, `${appDir}/dist`) : undefined,
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
    config.resolve.alias.set("@web", path.resolve(__dirname, "web"));

    if (!isMainApp) {
      config.plugin("html").tap((args) => {
        args[0].template = path.resolve(__dirname, `${appDir}/template.html`);
        args[0].title = "Scoot Map Manager";
        return args;
      });
    }
  },
  devServer: {
    port: isMainApp ? 8080 : 7070,
  },
};
