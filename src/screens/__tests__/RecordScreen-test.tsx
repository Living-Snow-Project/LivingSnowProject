import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RecordScreen from "../RecordScreen";
import { getAtlasPickerItem, getAllAtlasPickerItems } from "../../record/Atlas";
import { setAppSettings } from "../../../AppSettings";
import TestIds from "../../constants/TestIds";
import { Notifications, Placeholders } from "../../constants/Strings";
import * as RecordManager from "../../lib/RecordManager";
import { makeExampleRecord } from "../../record/Record";

const isAtlasVisible = (queryByText) => queryByText("Atlas Surface Data");
const isTubeIdVisible = (queryByText) => queryByText("Tube Id");

let renderer;
let uploadRecord;
const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  setOptions: ({ headerRight }) => {
    uploadRecord = headerRight;
  },
};

const renderWithGpsWarningOff = () => {
  const testCoordinates = "123.456, -98.765";

  setAppSettings((prev) => ({
    ...prev,
    name: "test name",
    organization: "test organization",
    showGpsWarning: false,
  }));

  const {
    getByDisplayValue,
    getByPlaceholderText,
    getByTestId,
    queryByTestId,
  } = render(<RecordScreen navigation={navigation} />);

  expect(queryByTestId(TestIds.GPS.gpsManualInputTestId)).toBeNull();
  fireEvent.press(getByTestId(TestIds.GPS.gpsManualPressableTestId));
  expect(queryByTestId(TestIds.GPS.gpsManualPressableTestId)).toBeNull();
  expect(
    getByPlaceholderText(Placeholders.GPS.EnterCoordinates)
  ).not.toBeNull();

  fireEvent.changeText(
    getByPlaceholderText(Placeholders.GPS.EnterCoordinates),
    testCoordinates
  );

  return {
    expectedCoordinates: testCoordinates,
    getByDisplayValue,
    getByPlaceholderText,
    getByTestId,
  };
};

describe("RecordScreen test suite", () => {
  beforeEach(() => {
    renderer = render(<RecordScreen navigation={navigation} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders", () => {
    const { getByTestId } = renderer;
    fireEvent.press(getByTestId("calendar-pressable"));
    fireEvent(getByTestId("calendar"), "onDayPress", {
      dateString: "2022-01-01",
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  describe("Record type picker tests", () => {
    test("Sample selected", () => {
      const { queryByText } = renderer;
      expect(isAtlasVisible(queryByText)).toBeFalsy();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();
    });

    test("Sighting selected", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(getByTestId("record-type-picker"), "onValueChange", "Sighting");
      expect(isAtlasVisible(queryByText)).toBeFalsy();
      expect(isTubeIdVisible(queryByText)).toBeFalsy();
    });
  });

  describe("GPS coordinate tests", () => {
    test("with Expo.Location", () => {
      const { getByTestId, queryByTestId } = renderer;
      const noButtonMock = jest.fn();
      const alertMock = jest.spyOn(Alert, "alert").mockImplementationOnce(
        (title, message, buttons) =>
          // @ts-ignore
          noButtonMock(buttons[1]) // No button
      );

      fireEvent.press(getByTestId(TestIds.GPS.gpsManualPressableTestId));
      expect(queryByTestId(TestIds.GPS.gpsManualInputTestId)).toBeNull();
      expect(noButtonMock).toHaveBeenLastCalledWith({
        text: "No",
        style: "cancel",
      });
      alertMock.mockReset();
    });

    test("manual with confirmation", () => {
      const {
        getByDisplayValue,
        getByPlaceholderText,
        getByTestId,
        queryByTestId,
      } = renderer;
      const testCoordinates = "123.456, -98.765";
      const alertMock = jest.spyOn(Alert, "alert").mockImplementationOnce(
        (title, message, buttons) =>
          // @ts-ignore
          buttons[0].onPress() // Yes button
      );

      fireEvent.press(getByTestId(TestIds.GPS.gpsManualPressableTestId));
      expect(
        getByPlaceholderText(Placeholders.GPS.EnterCoordinates)
      ).not.toBeNull();

      fireEvent.changeText(
        getByTestId(TestIds.GPS.gpsManualInputTestId),
        testCoordinates
      );
      expect(getByDisplayValue(testCoordinates)).not.toBeNull();

      // pressable modal shouldn't be 1. visible, 2. prompt again, or 3. reset coordinates
      fireEvent.press(getByTestId(TestIds.GPS.gpsManualInputTestId));
      expect(queryByTestId(TestIds.GPS.gpsManualPressableTestId)).toBeNull();
      expect(alertMock).toBeCalledTimes(1);
      expect(getByDisplayValue(testCoordinates)).not.toBeNull();
      alertMock.mockReset();
    });

    test("manual without confirmation", async () => {
      const alertMock = jest.spyOn(Alert, "alert");

      const { expectedCoordinates, getByDisplayValue } =
        renderWithGpsWarningOff();

      expect(getByDisplayValue(expectedCoordinates)).not.toBeNull();
      fireEvent(getByDisplayValue(expectedCoordinates), "onSubmitEditing");
      expect(alertMock).not.toBeCalled();
      alertMock.mockReset();
    });
  });

  describe("Atlas picker tests", () => {
    test("Red Dot", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Red Dot"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeFalsy();
    });

    test("Red Dot with Sample", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Red Dot with Sample"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();
    });

    test("Blue Dot", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Blue Dot"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeFalsy();
    });

    test("Blue Dot with Sample", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Blue Dot with Sample"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();
    });

    test("Red Dot surface picker", () => {
      const { getByDisplayValue, getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Red Dot"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeFalsy();

      const atlasTypes = getAllAtlasPickerItems();
      atlasTypes.forEach((item) => {
        fireEvent(
          getByTestId(TestIds.Pickers.atlastSelectorTestId),
          "onValueChange",
          item.value
        );
        expect(getByDisplayValue(item.label)).toBeTruthy();
      });
    });

    test("Red Dot with Sample surface picker", () => {
      const { getByDisplayValue, getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Red Dot with Sample"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();

      const atlasTypes = [
        getAtlasPickerItem("Snow Algae"),
        getAtlasPickerItem("Mix of Algae and Dirt"),
      ];
      atlasTypes.forEach((item) => {
        fireEvent(
          getByTestId(TestIds.Pickers.atlastSelectorTestId),
          "onValueChange",
          item.value
        );
        expect(getByDisplayValue(item.label)).toBeTruthy();
      });
    });

    test("Blue Dot surface picker", () => {
      const { getByDisplayValue, getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Blue Dot"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeFalsy();

      const atlasTypes = getAllAtlasPickerItems();
      atlasTypes.forEach((item) => {
        fireEvent(
          getByTestId(TestIds.Pickers.atlastSelectorTestId),
          "onValueChange",
          item.value
        );
        expect(getByDisplayValue(item.label)).toBeTruthy();
      });
    });

    test("Blue Dot with Sample surface picker", () => {
      const { getByDisplayValue, getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Blue Dot with Sample"
      );
      expect(isAtlasVisible(queryByText)).toBeTruthy();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();

      const atlasTypes = [
        getAtlasPickerItem("Snow Algae"),
        getAtlasPickerItem("Mix of Algae and Dirt"),
      ];
      atlasTypes.forEach((item) => {
        fireEvent(
          getByTestId(TestIds.Pickers.atlastSelectorTestId),
          "onValueChange",
          item.value
        );
        expect(getByDisplayValue(item.label)).toBeTruthy();
      });
    });

    test("Type selection from Atlas back to not Atlas", () => {
      const { getByTestId, queryByText } = renderer;
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Blue Dot with Sample"
      );

      expect(isAtlasVisible(queryByText)).toBeTruthy();

      fireEvent(getByTestId("record-type-picker"), "onValueChange", "Sighting");
      expect(isAtlasVisible(queryByText)).toBeFalsy();
    });
  });

  describe("TextInput tests", () => {
    test("TubeId", () => {
      const { getByPlaceholderText, getByDisplayValue } = renderer;
      const tubeId = getByPlaceholderText(Placeholders.RecordScreen.TubeId);
      const expected = "123-456";

      fireEvent.changeText(tubeId, expected);
      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(tubeId, "onSubmitEditing");
    });

    test("Location Description", () => {
      const { getByPlaceholderText, getByDisplayValue } = renderer;
      const location = getByPlaceholderText(
        Placeholders.RecordScreen.LocationDescription
      );
      const expected = "Excelsior Pass on High Divide Trail";

      fireEvent.changeText(location, expected);
      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(location, "onSubmitEditing");
    });

    test("Notes", () => {
      const { getByPlaceholderText, getByDisplayValue } = renderer;
      const notes = getByPlaceholderText(Placeholders.RecordScreen.Notes);
      const expected = "Frozen lake in a cold place with runnels of red snow";

      fireEvent.changeText(notes, expected);
      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(notes, "onSubmitEditing");
    });
  });

  describe("Photo tests", () => {
    test("navigate to camera roll selection screen", () => {
      const { getByTestId } = renderer;
      navigation.navigate.mockImplementationOnce(
        (route: string, params: { onUpdatePhotos: (uris: any) => void }) => {
          expect(route).toEqual("ImageSelection");
          params.onUpdatePhotos([]);
        }
      );

      fireEvent.press(getByTestId(TestIds.Photos.photoSelectorTestId));
      expect(navigation.navigate).toBeCalledTimes(1);
    });
  });

  // navigation header component is independent of RecordScreen component
  describe("Upload tests", () => {
    let screenTestCoordinates;
    let screenGetByTestId;
    let screenGetByDisplayValue;
    let screenGetByPlaceholderText;

    beforeEach(() => {
      const recordScreen = renderWithGpsWarningOff();
      screenTestCoordinates = recordScreen.expectedCoordinates;
      screenGetByTestId = recordScreen.getByTestId;
      screenGetByDisplayValue = recordScreen.getByDisplayValue;
      screenGetByPlaceholderText = recordScreen.getByPlaceholderText;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test("upload record successfully", async () => {
      const uploadButtonGetByTestId = render(uploadRecord()).getByTestId;

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce(() =>
          Promise.resolve(makeExampleRecord("Sample"))
        );

      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message) => {
          expect(title).toEqual(Notifications.uploadSuccess.title);
          expect(message).toEqual(Notifications.uploadSuccess.message);
        });

      fireEvent.press(
        uploadButtonGetByTestId(TestIds.RecordScreen.UploadButton)
      );

      await waitFor(() => expect(navigation.goBack).toBeCalled());
      expect(uploadMock).toBeCalled();
      expect(alertMock).toBeCalled();
    });

    test("upload record successfully, empty fields are deleted", async () => {
      const uploadButtonGetByTestId = render(uploadRecord()).getByTestId;

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce((record: AlgaeRecord) =>
          Promise.resolve(record)
        );

      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message) => {
          expect(title).toEqual(Notifications.uploadSuccess.title);
          expect(message).toEqual(Notifications.uploadSuccess.message);
        });

      // simulates user entering text then deleting it
      fireEvent.changeText(
        screenGetByPlaceholderText(Placeholders.RecordScreen.TubeId),
        ""
      );

      fireEvent.changeText(
        screenGetByPlaceholderText(Placeholders.RecordScreen.Notes),
        ""
      );

      fireEvent.changeText(
        screenGetByPlaceholderText(
          Placeholders.RecordScreen.LocationDescription
        ),
        ""
      );

      // simulates user selecting Atlas then selecting non-Atlas
      fireEvent(
        screenGetByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Atlas: Red Dot"
      );

      fireEvent(
        screenGetByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Sample"
      );

      // upload record
      fireEvent.press(
        uploadButtonGetByTestId(TestIds.RecordScreen.UploadButton)
      );

      await waitFor(() => expect(navigation.goBack).toBeCalled());

      expect(alertMock).toBeCalled();
      expect(uploadMock).toBeCalled();
      const receivedRecord = uploadMock.mock.calls[0][0];
      expect(receivedRecord.tubeId).not.toBeDefined();
      expect(receivedRecord.notes).not.toBeDefined();
      expect(receivedRecord.locationDescription).not.toBeDefined();
      expect(receivedRecord.atlasType).not.toBeDefined();
    });

    test("upload record invalid user input", () => {
      const uploadButtonGetByTestId = render(uploadRecord()).getByTestId;

      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message) => {
          expect(title).toEqual(Notifications.invalidCoordinates.title);
          expect(message).toEqual(Notifications.invalidCoordinates.message);
        });

      fireEvent.changeText(
        screenGetByDisplayValue(screenTestCoordinates),
        "garbage, coordinates"
      );

      fireEvent.press(
        uploadButtonGetByTestId(TestIds.RecordScreen.UploadButton)
      );

      expect(alertMock).toBeCalled();
    });

    test("upload record network failure", async () => {
      const uploadButtonGetByTestId = render(uploadRecord()).getByTestId;

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce(() => Promise.reject());

      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message) => {
          expect(title).toEqual(Notifications.uploadFailed.title);
          expect(message).toEqual(Notifications.uploadFailed.message);
        });

      fireEvent.press(
        uploadButtonGetByTestId(TestIds.RecordScreen.UploadButton)
      );

      await waitFor(() => expect(navigation.goBack).toBeCalled());
      expect(uploadMock).toBeCalled();
      expect(alertMock).toBeCalled();
    });
  });
});
