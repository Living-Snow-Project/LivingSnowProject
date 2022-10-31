import "@testing-library/jest-native/extend-expect";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// https://github.com/callstack/react-native-testing-library/issues/329
jest.mock("react-native/Libraries/Components/Switch/Switch", () => {
  const mockComponent = require("react-native/jest/mockComponent");
  return mockComponent("react-native/Libraries/Components/Switch/Switch");
});

// useNativeDriver for animations doesn't exist in test environment
// https://github.com/ptomasroos/react-native-scrollable-tab-view/issues/642
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// TimelineRow calls useNavigation
const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

export { mockedNavigate };
