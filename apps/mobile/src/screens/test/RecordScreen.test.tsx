import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AlgaeRecord, Photo, makeExampleRecord } from "@livingsnow/record";
import {
  RecordScreenNavigationProp,
  RecordScreenRouteProp,
} from "../../navigation/Routes";
import RecordScreen from "../RecordScreen";
import { setAppSettings } from "../../../AppSettings";
import TestIds from "../../constants/TestIds";
import { Notifications, Placeholders } from "../../constants/Strings";
import * as RecordManager from "../../lib/RecordManager";
import * as Storage from "../../lib/Storage";
import { RecordReducerActionsContext } from "../../hooks/useAlgaeRecords";
import { makeRecordReducerActionsMock } from "../../mocks/useRecordReducer.mock";

const isTubeIdVisible = (queryByText) => queryByText("Tube Id");

// record action button renders independently of the screen
let recordActionButton: () => JSX.Element;

// mock navigation prop
const navigation = {} as RecordScreenNavigationProp;
navigation.goBack = jest.fn();
navigation.navigate = jest.fn();
navigation.setOptions = ({
  headerRight,
}: {
  headerRight: () => JSX.Element;
}) => {
  recordActionButton = headerRight;
};

const defaultRouteProp = undefined as unknown as RecordScreenRouteProp;

const customRender = (route: RecordScreenRouteProp = defaultRouteProp) => {
  /* eslint-disable react/jsx-no-constructed-context-values */
  const recordActionsContext = {
    ...makeRecordReducerActionsMock(),
    uploadRecord: (record: AlgaeRecord, photos: Photo[]): Promise<void> =>
      RecordManager.uploadRecord(record, photos).then(() => Promise.resolve()),
    updatePendingRecord: (record: AlgaeRecord): Promise<void> =>
      Storage.updatePendingRecord(record).then(() => Promise.resolve()),
  };

  return render(
    <RecordReducerActionsContext.Provider value={recordActionsContext}>
      <RecordScreen navigation={navigation} route={route} />
    </RecordReducerActionsContext.Provider>
  );
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
  } = customRender();

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders", () => {
    const { getByTestId, toJSON } = customRender();
    fireEvent.press(getByTestId("calendar-pressable"));
    fireEvent(getByTestId("calendar"), "onDayPress", {
      dateString: "2022-01-01",
    });
    expect(toJSON()).toMatchSnapshot();
  });

  describe("Record type picker tests", () => {
    test("Sample selected", () => {
      const { queryByText } = customRender();
      expect(isTubeIdVisible(queryByText)).toBeTruthy();
    });

    test("Sighting selected", () => {
      const { getByTestId, queryByText } = customRender();
      fireEvent(
        getByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Sighting"
      );
      expect(isTubeIdVisible(queryByText)).toBeFalsy();
    });
  });

  describe("GPS coordinate tests", () => {
    test("with Expo.Location", () => {
      const { getByTestId, queryByTestId } = customRender();
      const noButtonMock = jest.fn();
      const alertMock = jest.spyOn(Alert, "alert").mockImplementationOnce(
        (title, message, buttons) =>
          // @ts-ignore
          noButtonMock(buttons[1]) // No button
      );

      fireEvent.press(getByTestId(TestIds.GPS.gpsManualPressableTestId));
      expect(queryByTestId(TestIds.GPS.gpsManualInputTestId)).toBeNull();
      expect(alertMock).toBeCalledTimes(1);
      expect(noButtonMock).toHaveBeenLastCalledWith({
        text: "No",
        style: "cancel",
      });
    });

    test("manual with confirmation", () => {
      const {
        getByDisplayValue,
        getByPlaceholderText,
        getByTestId,
        queryByTestId,
      } = customRender();
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
    });

    test("manual without confirmation", async () => {
      const alertMock = jest.spyOn(Alert, "alert");

      const { expectedCoordinates, getByDisplayValue } =
        renderWithGpsWarningOff();

      expect(getByDisplayValue(expectedCoordinates)).not.toBeNull();
      fireEvent(getByDisplayValue(expectedCoordinates), "onSubmitEditing");

      expect(alertMock).not.toBeCalled();
    });
  });

  describe("TextInput tests", () => {
    test("TubeId", () => {
      const { getByPlaceholderText, getByDisplayValue } = customRender();
      const tubeId = getByPlaceholderText(Placeholders.RecordScreen.TubeId);
      const expected = "123-456";

      fireEvent.changeText(tubeId, expected);
      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(tubeId, "onSubmitEditing");
    });

    test("Location Description", () => {
      const { getByPlaceholderText, getByDisplayValue } = customRender();
      const location = getByPlaceholderText(
        Placeholders.RecordScreen.LocationDescription
      );
      const expected = "Excelsior Pass on High Divide Trail";

      fireEvent.changeText(location, expected);

      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(location, "onSubmitEditing");
    });

    test("Notes", () => {
      const { getByPlaceholderText, getByDisplayValue } = customRender();
      const notes = getByPlaceholderText(Placeholders.RecordScreen.Notes);
      const expected = "Frozen lake in a cold place with runnels of red snow";

      fireEvent.changeText(notes, expected);

      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(notes, "onSubmitEditing");
    });
  });

  describe("Photo tests", () => {
    test("navigate to camera roll selection screen", () => {
      const { getByTestId } = customRender();
      navigation.navigate = jest
        .fn()
        .mockImplementationOnce(
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

      screenGetByTestId = recordScreen.getByTestId;

      fireEvent(
        screenGetByTestId(TestIds.Pickers.algaeSizePickerTestId),
        "onValueChange",
        "Fist"
      );

      fireEvent(
        screenGetByTestId(TestIds.Pickers.algaeColorPickerTestId),
        "onValueChange",
        "Red"
      );

      screenTestCoordinates = recordScreen.expectedCoordinates;
      screenGetByDisplayValue = recordScreen.getByDisplayValue;
      screenGetByPlaceholderText = recordScreen.getByPlaceholderText;
    });

    test("upload record successfully", async () => {
      const { getByTestId } = render(recordActionButton());

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce(() =>
          Promise.resolve(makeExampleRecord("Sample"))
        );

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        )
      );
      expect(navigation.goBack).toBeCalled();
      expect(uploadMock).toBeCalled();
    });

    test("upload record successfully, empty fields are deleted", async () => {
      const { getByTestId } = render(recordActionButton());

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce((record: AlgaeRecord) =>
          Promise.resolve(record)
        );

      const alertMock = jest.spyOn(Alert, "alert");

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

      fireEvent(
        screenGetByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Sample"
      );

      // upload record
      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        )
      );

      expect(navigation.goBack).toBeCalled();
      expect(uploadMock).toBeCalled();
      const receivedRecord = uploadMock.mock.calls[0][0];
      expect(receivedRecord.tubeId).not.toBeDefined();
      expect(receivedRecord.notes).not.toBeDefined();
      expect(receivedRecord.locationDescription).not.toBeDefined();
    });

    test("upload record invalid gps user input", async () => {
      const { getByTestId } = render(recordActionButton());

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent.changeText(
        screenGetByDisplayValue(screenTestCoordinates),
        "garbage, coordinates"
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.invalidCoordinates.title,
          Notifications.invalidCoordinates.message
        )
      );
    });

    test("upload record invalid algae size user input", async () => {
      const { getByTestId } = render(recordActionButton());

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent(
        screenGetByTestId(TestIds.Pickers.algaeSizePickerTestId),
        "onValueChange",
        "Select a size"
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      await waitFor(() =>
        expect(alertMock).toBeCalledWith(Notifications.invalidAlgaeSize.title)
      );
    });

    test("upload record invalid algae color user input", async () => {
      const { getByTestId } = render(recordActionButton());

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent(
        screenGetByTestId(TestIds.Pickers.algaeColorPickerTestId),
        "onValueChange",
        "Select a color"
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      await waitFor(() =>
        expect(alertMock).toBeCalledWith(Notifications.invalidAlgaeColor.title)
      );
    });

    test("upload record network failure", async () => {
      const { getByTestId } = render(recordActionButton());
      const uploadError = {
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      };

      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockRejectedValueOnce(uploadError);

      const alertSpy = jest.spyOn(Alert, "alert");

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      return waitFor(() => expect(navigation.goBack).toBeCalled()).then(() =>
        waitFor(() =>
          expect(alertSpy).toBeCalledWith(
            Notifications.uploadRecordFailed.title,
            Notifications.uploadRecordFailed.message
          )
        ).then(() => {
          expect(uploadMock).toBeCalled();
        })
      );
    });
  });

  describe("Edit mode tests", () => {
    let record: AlgaeRecord;
    let recordScreen;

    beforeEach(() => {
      record = makeExampleRecord("Sample");
      // internally, RecordScreen maps Photo to SelectedPhoto, so we have to modify our expected results
      record.photos = [
        {
          id: "",
          width: 100,
          height: 200,
          size: 0,
          uri: "46",
        } as unknown as Photo,
        {
          id: "",
          width: 100,
          height: 200,
          size: 0,
          uri: "23",
        } as unknown as Photo,
      ];

      recordScreen = customRender({
        params: { record },
      } as RecordScreenRouteProp);

      return Storage.savePendingRecord(record);
    });

    test("renders", () => {
      const { toJSON } = recordScreen;

      expect(toJSON()).toMatchSnapshot();
    });

    test("update record successfully", async () => {
      const { getByTestId } = render(recordActionButton());
      const screenGetByTestId = recordScreen.getByTestId;

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent(
        screenGetByTestId(TestIds.Pickers.recordSelectorTestId),
        "onValueChange",
        "Sighting"
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      record.type = "Sighting";
      delete record.tubeId;

      return waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.updateRecordSuccess.title
        )
      ).then(() => {
        expect(navigation.goBack).toBeCalled();

        return Storage.loadPendingRecords().then((received) => {
          expect(received[0]).toEqual(record);
        });
      });
    });

    test("update record invalid user input", async () => {
      const screenGetByDisplayValue = recordScreen.getByDisplayValue;

      const { getByTestId } = render(recordActionButton());

      const alertMock = jest.spyOn(Alert, "alert");

      fireEvent.changeText(
        screenGetByDisplayValue(`${record.latitude}, ${record.longitude}`),
        "garbage, coordinates"
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      return waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.invalidCoordinates.title,
          Notifications.invalidCoordinates.message
        )
      );
    });

    test("update record fails", async () => {
      const { getByTestId } = render(recordActionButton());

      const alertMock = jest.spyOn(Alert, "alert");

      jest.spyOn(Storage, "updatePendingRecord").mockRejectedValueOnce("error");

      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      return waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.updateRecordFailed.title,
          Notifications.updateRecordFailed.message
        )
      );
    });
  });
});
