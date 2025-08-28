import React from "react";
import { Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { PressableOpacity } from "../PressableOpacity";

describe("PressableOpacity test suite", () => {
  const testID = "pressable-testid";

  test("press", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PressableOpacity
        testID={testID}
        onPress={onPress}
        testOnly_pressed={testID.includes(testID)}
      >
        <Text>child text</Text>
      </PressableOpacity>,
    );

    fireEvent.press(getByTestId(testID));
    expect(onPress).toBeCalled();
  });
});
