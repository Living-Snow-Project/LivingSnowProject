import React from "react";
import { Platform } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { HeaderButton } from "../screens";

describe("HeaderButton test suite", () => {
  const testID = "test-button";

  test("renders left on ios", () => {
    const onPress = jest.fn();
    const { getByTestId, toJSON } = render(
      <NativeBaseProviderForTesting>
        <HeaderButton
          testID={testID}
          iconName="snow"
          onPress={onPress}
          placement="left"
        />
      </NativeBaseProviderForTesting>
    );

    fireEvent.press(getByTestId(testID));
    expect(onPress).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  test("renders right on android", () => {
    Platform.OS = "android";
    const onPress = jest.fn();
    const { getByTestId, toJSON } = render(
      <NativeBaseProviderForTesting>
        <HeaderButton
          testID={testID}
          iconName="snow"
          onPress={onPress}
          placement="right"
        />
      </NativeBaseProviderForTesting>
    );

    Platform.OS = "ios";

    fireEvent.press(getByTestId(testID));
    expect(onPress).toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });
});
