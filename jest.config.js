/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
    "!**/expo-images-picker/**",
    "!**/node_modules/**",
    "!**/types/**",
    "!**/@types/AppSettings.ts",
    "!**/babel.config.js",
    "!**/jest.config.js",
    "!**/jesttest.setup.js",
    "!**/src/lib/Logger.ts",
    "!**/src/navigation/Routes.ts",
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
