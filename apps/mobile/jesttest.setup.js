import "@testing-library/jest-native/extend-expect";
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { NativeBaseProvider } from "native-base";
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// useNativeDriver for animations doesn't exist in test environment
// https://github.com/ptomasroos/react-native-scrollable-tab-view/issues/642
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-native", () => {
  const rn = jest.requireActual("react-native");
  jest
    .spyOn(rn.Animated, "View", "get")
    .mockImplementation(() => jest.fn(({ children }) => children));

  return rn;
});

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

// https://docs.nativebase.io/testing
const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function NativeBaseProviderForTesting({ children }) {
  return (
    <NativeBaseProvider initialWindowMetrics={inset}>
      {children}
    </NativeBaseProvider>
  );
}

export { mockedNavigate, NativeBaseProviderForTesting };
