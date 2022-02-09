import React from "react";
import { Keyboard, Platform, TextInput } from "react-native";
import { render } from "@testing-library/react-native";
import KeyboardShift from "../KeyboardShift";

const { State: TextInputState } = TextInput;

describe("KeyboardShift test suite", () => {
  test("renders on ios", () => {
    const { toJSON } = render(
      <KeyboardShift>{() => <TextInput />}</KeyboardShift>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("renders on android", () => {
    Platform.OS = "android";
    const { toJSON, unmount } = render(
      <KeyboardShift>{() => <TextInput />}</KeyboardShift>
    );

    expect(toJSON()).toMatchSnapshot();

    unmount();

    Platform.OS = "ios";
  });

  test("emit keyboard events", async () => {
    const event = {
      endCoordinates: {
        height: 50,
      },
    };

    render(<KeyboardShift>{() => <TextInput />}</KeyboardShift>);

    // the best we can do is execute the code and make sure it doesn't crash
    Keyboard.emit("keyboardDidShow");

    jest
      .spyOn(TextInputState, "currentlyFocusedInput")
      // @ts-ignore
      .mockImplementation(() => ({
        measure: (cb) => {
          cb(0, 0, 0, 50, 0, 50);
        },
      }));

    // gap = NaN
    Keyboard.emit("keyboardDidShow");

    // gap >= 0
    Keyboard.emit("keyboardDidShow", event);
    Keyboard.emit("keyboardDidHide");

    event.endCoordinates.height = 5000;
    // gap < 0
    Keyboard.emit("keyboardDidShow", event);
    Keyboard.emit("keyboardDidHide");

    // wait for the keyboard hiding animation to finish
    await new Promise((r) => {
      setTimeout(r, 250);
    });
  });
});
