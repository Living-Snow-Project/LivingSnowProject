/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/src/navigation/Routes.ts",
    "!**/@types/AppSettings.ts",
    "!**/src/lib/Logger.ts",
    "!**/coverage/**",
    "!**/expo-images-picker/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jesttest.setup.js",
    "!**/jest.config.js",
  ],
  moduleFileExtensions: ["ts", "tsx", "js"],
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "./jesttest.setup.js",
    "@testing-library/jest-native/extend-expect",
  ],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  verbose: true,
};
