import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AlgaeRecord, Photo, makeExampleRecord } from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import {
  RecordScreenNavigationProp,
  RecordScreenRouteProp,
} from "../../navigation/Routes";
import { RecordScreen } from "../RecordScreen";
import { setAppSettings } from "../../../AppSettings";
import { TestIds } from "../../constants/TestIds";
import { Labels, Notifications, Placeholders } from "../../constants/Strings";
import * as RecordManager from "../../lib/RecordManager";
import * as Storage from "../../lib/Storage";
import { AlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { makeAlgaeRecordsMock } from "../../mocks/useAlgaeRecords.mock";

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
  const algaeRecords = {
    ...makeAlgaeRecordsMock(),
    uploadRecord: (record: AlgaeRecord, photos: Photo[]): Promise<void> =>
      RecordManager.uploadRecord(record, photos).then(() => Promise.resolve()),
    updatePendingRecord: (record: AlgaeRecord): Promise<void> =>
      Storage.updatePendingRecord(record).then(() => Promise.resolve()),
  };

  return render(
    <NativeBaseProviderForTesting>
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <RecordScreen navigation={navigation} route={route} />
      </AlgaeRecordsContext.Provider>
    </NativeBaseProviderForTesting>
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

  const { getByDisplayValue, getByPlaceholderText, getByTestId } =
    customRender();

  fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));
  // TODO: I have no way of testing if Modal is visible or not
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

  describe("Record type selector tests", () => {
    test("Sample selected", () => {
      const { getByTestId, queryByPlaceholderText } = customRender();

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sample"
      );

      expect(
        queryByPlaceholderText(Placeholders.RecordScreen.TubeId)
      ).toBeTruthy();
    });

    test("Sighting selected", () => {
      const { getByTestId, queryByPlaceholderText } = customRender();

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sighting"
      );

      expect(
        queryByPlaceholderText(Placeholders.RecordScreen.TubeIdDisabled)
      ).toBeTruthy();
    });
  });

  describe("GPS coordinate tests", () => {
    test("with Expo.Location", () => {
      const { getByTestId, queryByText } = customRender();

      fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));

      // TODO: I have no way of testing if Modal is visible or not
      // these tests are always true if the modal is visible or not
      expect(queryByText(Labels.Modal.Cancel)).toBeTruthy();
      expect(queryByText(Labels.Modal.Confirm)).toBeTruthy();
    });

    test("manual with confirmation", () => {
      const {
        getByDisplayValue,
        queryByDisplayValue,
        getByPlaceholderText,
        queryByPlaceholderText,
        getByTestId,
        getByText,
        queryByTestId,
      } = customRender();
      const testCoordinates = "123.456, -98.765";

      fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));
      fireEvent.press(getByText(Labels.Modal.Confirm));

      return waitFor(() =>
        expect(
          queryByPlaceholderText(Placeholders.GPS.EnterCoordinates)
        ).toBeTruthy()
      ).then(() => {
        fireEvent.changeText(
          getByPlaceholderText(Placeholders.GPS.EnterCoordinates),
          testCoordinates
        );

        return waitFor(() =>
          expect(queryByDisplayValue(testCoordinates)).toBeTruthy()
        ).then(() => {
          // manual coordinates modal shouldn't prompt again or reset coordinates
          // TODO: no way to test if modal is visible or not
          fireEvent.press(getByDisplayValue(testCoordinates));

          expect(
            queryByTestId(TestIds.GPS.GpsManualEntryPressable)
          ).toBeTruthy();
          expect(getByDisplayValue(testCoordinates)).toBeTruthy();
        });
      });
    });

    test("manual without confirmation", () => {
      const { expectedCoordinates, getByDisplayValue } =
        renderWithGpsWarningOff();

      expect(getByDisplayValue(expectedCoordinates)).toBeTruthy();
    });
  });

  describe("TextInput tests", () => {
    test("TubeId", () => {
      const { getByPlaceholderText, getByDisplayValue, getByTestId } =
        customRender();
      const tubeId = getByPlaceholderText(
        Placeholders.RecordScreen.TubeIdDisabled
      );
      const expected = "123-456";

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sample"
      );
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
        .mockImplementationOnce((screen: string) => {
          expect(screen).toEqual("ImageSelection");
        });

      fireEvent.press(getByTestId(TestIds.Selectors.Photos));

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
        screenGetByPlaceholderText(Placeholders.RecordScreen.Size),
        "onValueChange",
        "Fist"
      );

      fireEvent(
        screenGetByTestId(TestIds.Selectors.AlgaeColor),
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
        screenGetByTestId(TestIds.Selectors.RecordType),
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
        screenGetByTestId(TestIds.Selectors.AlgaeSize),
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
        screenGetByTestId(TestIds.Selectors.AlgaeColor),
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
        params: { record: JSON.stringify(record) },
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
        screenGetByTestId(TestIds.Selectors.RecordType),
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
