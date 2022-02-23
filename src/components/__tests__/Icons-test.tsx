import React from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import { RecordIcon, PictureIcon, SnowIcon } from "../Icons";

describe("Icons test suite", () => {
  describe("android", () => {
    beforeEach(() => {
      Platform.OS = "android";
    });

    afterEach(() => {
      Platform.OS = "ios";
    });

    test("sample record icon", () => {
      const { toJSON } = render(<RecordIcon type="Sample" />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("sighting record icon", () => {
      const { toJSON } = render(<RecordIcon type="Sighting" />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("picture icon", () => {
      const { toJSON } = render(<PictureIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(<SnowIcon />);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe("ios", () => {
    test("sample record icon", () => {
      const { toJSON } = render(<RecordIcon type="Sample" />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("sighting record icon", () => {
      const { toJSON } = render(<RecordIcon type="Sighting" />);
      expect(toJSON()).toMatchSnapshot();
      Platform.OS = "ios";
    });

    test("picture icon", () => {
      const { toJSON } = render(<PictureIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(<SnowIcon />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
