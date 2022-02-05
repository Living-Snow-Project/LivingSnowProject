import "@testing-library/jest-native/extend-expect";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// https://github.com/callstack/react-native-testing-library/issues/329
jest.mock("react-native/Libraries/Components/Switch/Switch", () => {
  const mockComponent = require("react-native/jest/mockComponent");
  return mockComponent("react-native/Libraries/Components/Switch/Switch");
});
