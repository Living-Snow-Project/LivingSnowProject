import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Navigation from "../MainTabNavigator";
import { setAppSettings } from "../../../AppSettings";
import { Labels } from "../../constants/Strings";

// https://github.com/ptomasroos/react-native-scrollable-tab-view/issues/642
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

describe("Navigation test suite", () => {
  test("renders first run screen", () => {
    const { toJSON } = render(<Navigation />);

    expect(toJSON()).toMatchSnapshot();
  });

  test("renders timeline screen", async () => {
    setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
    const { getByText, toJSON } = render(<Navigation />);

    await waitFor(() => getByText(Labels.TimelineScreen.NoRecords));
    expect(toJSON()).toMatchSnapshot();
  });
});
