import React from "react";
import { Alert } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import RecordScreen from "../RecordScreen";
import { RecordType } from "../../record/Record";
import {
  AtlasType,
  getAtlasPickerItem,
  getAllAtlasPickerItems,
} from "../../record/Atlas";
import { AppSettings, setAppSettings } from "../../../AppSettings";

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

  test("TubeId user input", () => {
    const { getByPlaceholderText, getByDisplayValue } = renderer;
    const tubeId = getByPlaceholderText(
      "Leave blank if the tube does not have an id"
    );
    const expected = "123-456";

    fireEvent.changeText(tubeId, expected);
    expect(getByDisplayValue(expected)).not.toBeNull();
  });

  test("GPS coordinates use Expo.Location", () => {
    const { getByTestId, queryByTestId } = renderer;
    const spy = jest.fn();
    jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) =>
        // @ts-ignore
        spy(buttons[1])
      );

    fireEvent.press(getByTestId("manual-gps-pressable"));
    expect(queryByTestId("gps-coordaintes-text-input")).toBeNull();
    expect(spy).toHaveBeenLastCalledWith({ text: "No", style: "cancel" });
  });

  test("GPS coordinates, manual with confirmation", () => {
    const { getByDisplayValue, getByTestId } = renderer;
    const testCoordinates = "123.456, -98.765";
    jest.spyOn(Alert, "alert").mockImplementationOnce(
      (title, message, buttons) =>
        // @ts-ignore
        buttons[0].onPress() // Yes button
    );

    fireEvent.press(getByTestId("manual-gps-pressable"));
    fireEvent.changeText(
      getByTestId("gps-coordinates-text-input"),
      testCoordinates
    );

    // modal shouldn't prompt again or reset coordinates
    fireEvent.press(getByTestId("gps-coordinates-text-input"));
    expect(getByDisplayValue(testCoordinates)).not.toBeNull();
  });

  test("GPS coordinates, manual without confirmation", () => {
    const testCoordinates = "123.456, -98.765";
    const spy = jest.fn();
    jest.spyOn(Alert, "alert").mockImplementationOnce(() => spy());

    setAppSettings({ showGpsWarning: false } as AppSettings);

    const { getByDisplayValue, getByTestId } = render(
      <RecordScreen navigation={navigation} />
    );

    fireEvent.press(getByTestId("manual-gps-pressable"));
    fireEvent.changeText(
      getByTestId("gps-coordinates-text-input"),
      testCoordinates
    );

    expect(getByDisplayValue(testCoordinates)).not.toBeNull();
    expect(spy).not.toBeCalled();
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

  test("Location Description user input", () => {
    const { getByPlaceholderText, getByDisplayValue } = renderer;
    const location = getByPlaceholderText("ie: Blue Lake, North Cascades, WA");
    const expected = "Excelsior Pass on High Divide Trail";

    fireEvent.changeText(location, expected);
    expect(getByDisplayValue(expected)).not.toBeNull();
  });

  test("Notes user input", () => {
    const { getByPlaceholderText, getByDisplayValue } = renderer;
    const notes = getByPlaceholderText("ie. algae growing on glacial ice");
    const expected = "Frozen lake in a cold place with runnels of red snow";

    fireEvent.changeText(notes, expected);
    expect(getByDisplayValue(expected)).not.toBeNull();
  });

  test.todo("Photos");
});
