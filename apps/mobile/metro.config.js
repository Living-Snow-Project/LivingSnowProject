// Learn more https://docs.expo.dev/guides/monorepos
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;
// 4. keep mocks out of client bundle; previous blockList: /(website\\node_modules\\.*|.*\\__tests__\\.*)$/
config.resolver.blockList =
  /(website\\node_modules\\.*|.*\\__tests__\\.*|website\\src\\mocks\\.*)$/;
// Add .geojson to assetExts
config.resolver.assetExts.push("geojson");
module.exports = config;
