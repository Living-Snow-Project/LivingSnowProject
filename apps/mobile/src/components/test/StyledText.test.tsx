import React from "react";
import { render } from "@testing-library/react-native";
import { MonoText } from "../StyledText";

test("MonoText renders correctly", () => {
  const { toJSON } = render(<MonoText>Snapshot test!</MonoText>);

  expect(toJSON()).toMatchSnapshot();
});
