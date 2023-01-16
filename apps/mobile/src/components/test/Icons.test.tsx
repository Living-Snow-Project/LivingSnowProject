import React from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { PictureIcon, SnowIcon } from "../Icons";

describe("Icons test suite", () => {
  describe("android", () => {
    beforeEach(() => {
      Platform.OS = "android";
    });

    afterEach(() => {
      Platform.OS = "ios";
    });

    test("picture icon", () => {
      const { toJSON } = render(
        <NativeBaseProviderForTesting>
          <PictureIcon />
        </NativeBaseProviderForTesting>
      );
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(
        <NativeBaseProviderForTesting>
          <SnowIcon />
        </NativeBaseProviderForTesting>
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("ios", () => {
    test("picture icon", () => {
      const { toJSON } = render(
        <NativeBaseProviderForTesting>
          <PictureIcon />
        </NativeBaseProviderForTesting>
      );
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(
        <NativeBaseProviderForTesting>
          <SnowIcon />
        </NativeBaseProviderForTesting>
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
