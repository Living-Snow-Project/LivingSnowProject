import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RecordScreen from "../RecordScreen";
import { RecordType } from "../../record/Record";
import {
  AtlasType,
  getAtlasPickerItem,
  getAllAtlasPickerItems,
} from "../../record/Atlas";

const isAtlasVisible = (queryByText) => queryByText("Atlas Surface Data");
const isTubeIdVisible = (queryByText) => queryByText("Tube Id");

let renderer;
const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

describe("RecordScreen test suite", () => {
  beforeEach(() => {
    renderer = render(<RecordScreen navigation={navigation} />);
  });

  test("renders", () => {
    // Enter GPS coordinates

    // Enter Location Description

    // Enter Notes

    // Select Photos
    const { getByTestId } = renderer;
    fireEvent.press(getByTestId("calendar-pressable"));
    fireEvent(getByTestId("calendar"), "onDayPress", {
      dateString: "2022-01-01",
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  test("Sample selected", () => {
    const { queryByText } = renderer;
    expect(isAtlasVisible(queryByText)).toBeFalsy();
    expect(isTubeIdVisible(queryByText)).toBeTruthy();
  });

  test("Sighting selected", () => {
    const { getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.Sighting
    );
    expect(isAtlasVisible(queryByText)).toBeFalsy();
    expect(isTubeIdVisible(queryByText)).toBeFalsy();
  });

  test("TubeId user input", async () => {
    const { getByPlaceholderText, getByDisplayValue } = renderer;
    const tubeId = getByPlaceholderText(
      "Leave blank if the tube does not have an id"
    );
    const expected = "123-456";

    fireEvent.changeText(tubeId, expected);
    expect(getByDisplayValue(expected)).not.toBeNull();
  });

  test("Atlas: Red Dot selected", () => {
    const { getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasRedDot
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeFalsy();
  });

  test("Atlas: Red Dot with Sample selected", () => {
    const { getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasRedDotWithSample
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeTruthy();
  });

  test("Atlas: Blue Dot selected", () => {
    const { getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasBlueDot
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeFalsy();
  });

  test("Atlas: Blue Dot with Sample selected", () => {
    const { getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasRedDotWithSample
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeTruthy();
  });

  test("Atlas: Red Dot surface selections", () => {
    const { getByDisplayValue, getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasRedDot
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeFalsy();

    const atlasTypes = getAllAtlasPickerItems();
    atlasTypes.forEach((item) => {
      fireEvent(getByTestId("atlas-type-picker"), "onValueChange", item.value);
      expect(getByDisplayValue(item.label)).toBeTruthy();
    });
  });

  test("Atlas: Red Dot with Sample surface selections", () => {
    const { getByDisplayValue, getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasRedDotWithSample
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeTruthy();

    const atlasTypes = [
      getAtlasPickerItem(AtlasType.SnowAlgae),
      getAtlasPickerItem(AtlasType.MixOfAlgaeAndDirt),
    ];
    atlasTypes.forEach((item) => {
      fireEvent(getByTestId("atlas-type-picker"), "onValueChange", item.value);
      expect(getByDisplayValue(item.label)).toBeTruthy();
    });
  });

  test("Atlas: Blue Dot surface selections", () => {
    const { getByDisplayValue, getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasBlueDot
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeFalsy();

    const atlasTypes = getAllAtlasPickerItems();
    atlasTypes.forEach((item) => {
      fireEvent(getByTestId("atlas-type-picker"), "onValueChange", item.value);
      expect(getByDisplayValue(item.label)).toBeTruthy();
    });
  });

  test("Atlas: Blue Dot with Sample surface selections", () => {
    const { getByDisplayValue, getByTestId, queryByText } = renderer;
    fireEvent(
      getByTestId("record-type-picker"),
      "onValueChange",
      RecordType.AtlasBlueDotWithSample
    );
    expect(isAtlasVisible(queryByText)).toBeTruthy();
    expect(isTubeIdVisible(queryByText)).toBeTruthy();

    const atlasTypes = [
      getAtlasPickerItem(AtlasType.SnowAlgae),
      getAtlasPickerItem(AtlasType.MixOfAlgaeAndDirt),
    ];
    atlasTypes.forEach((item) => {
      fireEvent(getByTestId("atlas-type-picker"), "onValueChange", item.value);
      expect(getByDisplayValue(item.label)).toBeTruthy();
    });
  });
});
