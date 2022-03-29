import React from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import {
  DeleteIcon,
  EditIcon,
  PictureIcon,
  RecordIcon,
  ScrollTopIcon,
  SnowIcon,
} from "../Icons";

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

    test("scroll top icon", () => {
      const { toJSON } = render(<ScrollTopIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(<SnowIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("edit icon", () => {
      const { toJSON } = render(<EditIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("delete icon", () => {
      const { toJSON } = render(<DeleteIcon />);
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

    test("scroll top icon", () => {
      const { toJSON } = render(<ScrollTopIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("snow icon", () => {
      const { toJSON } = render(<SnowIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("edit icon", () => {
      const { toJSON } = render(<EditIcon />);
      expect(toJSON()).toMatchSnapshot();
    });

    test("delete icon", () => {
      const { toJSON } = render(<DeleteIcon />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
