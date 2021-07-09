const path = require("path");

const isMainApp = process.env.APP_TYPE === "main";
const appDir = isMainApp ? "src" : "web";

module.exports = {
  outputDir: !isMainApp ? path.resolve(__dirname, `${appDir}/dist`) : undefined,
  chainWebpack: (config) => {
    if (isMainApp) {
      config.resolve.alias.set("@", path.resolve(__dirname, appDir));
    } else {
      config.resolve.alias.set("@", path.resolve(__dirname, appDir));

      config.plugin("html").tap((args) => {
        args[0].template = path.resolve(__dirname, `${appDir}/template.html`);
        return args;
      });
    }
  },
  devServer: {
    port: isMainApp ? 8080 : 7070,
  },
};
