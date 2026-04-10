// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

// Find the project and workspace directories
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// keep mocks out of client bundle; previous blockList: /(website\\node_modules\\.*|.*\\__tests__\\.*)$/
config.resolver.blockList =
  /(website\\node_modules\\.*|.*\\__tests__\\.*|website\\src\\mocks\\.*)$/;

// Add .geojson to assetExts
config.resolver.assetExts.push("geojson");

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "tamagui.config.ts",
});
