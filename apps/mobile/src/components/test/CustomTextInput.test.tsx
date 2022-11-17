import React from "react";
import { Keyboard, Platform } from "react-native";
import { ReactTestInstance } from "react-test-renderer";
import { render, fireEvent } from "@testing-library/react-native";
import CustomTextInput from "../forms/CustomTextInput";

describe("CustomTextInput tests", () => {
  const props = {
    description: "test custom text input",
    placeholder: "custom text input placeholder",
    onChangeText: jest.fn(),
  };
  let renderer;
  let customTextInput: ReactTestInstance;

  beforeEach(() => {
    renderer = render(<CustomTextInput {...props} />);

    customTextInput = renderer.getByPlaceholderText(props.placeholder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // additional paddingTop in styles array
  test("renders on ios", () => {
    const { toJSON } = renderer;
    expect(toJSON()).toMatchSnapshot();
  });

  test("renders on android", () => {
    Platform.OS = "android";
    const { toJSON } = render(<CustomTextInput {...props} />);
    expect(toJSON()).toMatchSnapshot();
    Platform.OS = "ios";
  });

  test("change text", () => {
    const testText = "test text";
    const { getByDisplayValue } = renderer;

    expect(customTextInput).not.toBeNull();
    fireEvent.changeText(customTextInput, testText);
    expect(getByDisplayValue(testText)).not.toBeNull();
    expect(props.onChangeText).toHaveBeenCalledWith(testText);
  });

  test("multiline text", () => {
    const keyboardListener = jest.fn();

    Keyboard.addListener("keyboardDidShow", keyboardListener);

    // could not find an end user way to fire keyboard events in React Native
    // these implementation details simulate the multiline text input growing vertically
    // userEvents and testing-dom libraries currently only work browser environment
    fireEvent(customTextInput, "onContentSizeChange", {
      nativeEvent: { contentSize: { height: 30 } },
    });

    fireEvent(customTextInput, "onContentSizeChange", {
      nativeEvent: { contentSize: { height: 60 } },
    });

    expect(keyboardListener).toBeCalledTimes(1);
  });

  test("submit text", () => {
    const onSubmitEditing = jest.fn();
    const { getByPlaceholderText } = render(
      <CustomTextInput
        description="test submitting"
        placeholder={props.placeholder}
        maxLength={10}
        onChangeText={() => {}}
        onSubmitEditing={onSubmitEditing}
      />
    );

    fireEvent(getByPlaceholderText(props.placeholder), "onSubmitEditing");
    expect(onSubmitEditing).toBeCalledTimes(1);
  });
});
