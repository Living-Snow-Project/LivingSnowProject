const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// blockList: /(website\\node_modules\\.*|.*\\__tests__\\.*)$/
defaultConfig.resolver.blockList =
  /(website\\node_modules\\.*|.*\\__tests__\\.*|website\\src\\mocks\\.*)$/;

module.exports = defaultConfig;
