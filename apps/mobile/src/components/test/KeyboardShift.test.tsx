import React from "react";
import { Platform, TextInput } from "react-native";
import RCTDeviceEventEmitter from "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter";
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
    RCTDeviceEventEmitter.emit("keyboardDidShow", {});

    jest
      .spyOn(TextInputState, "currentlyFocusedInput")
      // @ts-ignore
      .mockImplementation(() => ({
        measure: (cb) => {
          cb(0, 0, 0, 50, 0, 50);
        },
      }));

    // gap = NaN
    RCTDeviceEventEmitter.emit("keyboardDidShow", {});

    // gap >= 0
    RCTDeviceEventEmitter.emit("keyboardDidShow", event);
    RCTDeviceEventEmitter.emit("keyboardDidHide", {});

    event.endCoordinates.height = 5000;
    // gap < 0
    RCTDeviceEventEmitter.emit("keyboardDidShow", event);
    RCTDeviceEventEmitter.emit("keyboardDidHide", {});

    // wait for the keyboard hiding animation to finish
    await new Promise((r) => {
      setTimeout(r, 250);
    });
  });
});
