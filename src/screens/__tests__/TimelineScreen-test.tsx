import React from "react";
import { render } from "@testing-library/react-native";
import TimelineScreen from "../TimelineScreen";

const navigation = {
  navigate: jest.fn(),
  addListener: () => () => {},
};

describe("TimelineScreen test suite", () => {
  test("renders", () => {
    const { toJSON } = render(<TimelineScreen navigation={navigation} />);
    expect(toJSON()).toMatchSnapshot();
  });

  test.todo("download records");
  test.todo("pendings records");
  test.todo("offline mode");
  test.todo("connection restored");
  test.todo("pull to refresh");
  test.todo("scrolling");
  test.todo("navigate to settings screen");
  test.todo("navigate to record screen");
  test.todo("navigate to record details screen");
});
