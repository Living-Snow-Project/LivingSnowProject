import React from "react";
import { render } from "@testing-library/react-native";
import RecordDetailsScreen from "../SettingsScreen";

describe("RecordDetailsScreen test suite", () => {
  test("renders", () => {
    const { toJSON } = render(<RecordDetailsScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
});
