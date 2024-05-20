import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Asset } from "expo-media-library";
import * as Location from "expo-location";
import { NavigationContainer } from "@react-navigation/native";
import {
  AlgaeRecord,
  jsonToRecord,
  makeExampleRecord,
} from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import {
  RecordScreenNavigationProp,
  RecordScreenRouteProp,
} from "../../navigation/Routes";
import { RecordScreen } from "../RecordScreen";
import { setAppSettings } from "../../../AppSettings";
import {
  Labels,
  Notifications,
  Placeholders,
  TestIds,
  Validations,
} from "../../constants";
import { PhotoManager } from "../../lib/PhotoManager";
import * as Storage from "../../lib/Storage";

// record action button renders independently of the screen
let recordActionButton: JSX.Element;

// mock navigation prop
const navigation = {} as RecordScreenNavigationProp;
navigation.goBack = jest.fn();
navigation.navigate = jest.fn();
navigation.setOptions = ({
  headerRight,
}: {
  headerRight: () => JSX.Element;
}) => {
  recordActionButton = (
    <NativeBaseProviderForTesting>{headerRight()}</NativeBaseProviderForTesting>
  );
};

jest.mock("expo-location", () => ({
  ...jest.requireActual("expo-location"),
  requestForegroundPermissionsAsync: () =>
    Promise.resolve({ status: "granted" }),
  watchPositionAsync: (options, callback) => {
    const location = {
      coords: {
        latitude: 123.456,
        longitude: -98.765,
      },
    };

    callback(location as Location.LocationObject);

    const unsub: Location.LocationSubscription = {
      remove() {},
    };

    return Promise.resolve<Location.LocationSubscription>(unsub);
  },
}));

jest.mock("expo-media-library", () => ({
  ...jest.requireActual("expo-media-library"),
  getPermissionsAsync: async () => Promise.resolve({ granted: true }),
}));

jest.mock("expo-image-picker", () => ({
  ...jest.requireActual("expo-image-picker"),
  launchImageLibraryAsync: async () => Promise.resolve({ canceled: true }),
}));

jest.useFakeTimers();

const defaultRouteProp = undefined as unknown as RecordScreenRouteProp;

const customRender = async (
  route: RecordScreenRouteProp = defaultRouteProp,
) => {
  const result = render(
    <NativeBaseProviderForTesting>
      <NavigationContainer>
        <RecordScreen navigation={navigation} route={route} />
      </NavigationContainer>
    </NativeBaseProviderForTesting>,
  );

  let coordinates = "123.456, -98.765";

  if (route && route.params && route.params.record) {
    const recordFromRoute = {
      ...jsonToRecord<AlgaeRecord>(route.params.record),
    };

    coordinates = `${recordFromRoute.latitude}, ${recordFromRoute.longitude}`;
  }

  // waitFor coordinates to render; the test finishes before watch location subscription set up
  await waitFor(() => result.findByDisplayValue(coordinates));

  return result;
};

const renderWithGpsWarningOff = async () => {
  const testCoordinates = "123.456, -98.765";

  setAppSettings((prev) => ({
    ...prev,
    name: "test name",
    organization: "test organization",
    showGpsWarning: false,
  }));

  const { getByDisplayValue, getByPlaceholderText, getByTestId } =
    await customRender();

  fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));
  // TODO: I have no way of testing if Modal is visible or not
  fireEvent.changeText(
    getByPlaceholderText(Placeholders.GPS.EnterCoordinates),
    testCoordinates,
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

  test("renders", async () => {
    const { getByTestId, toJSON } = await customRender();

    fireEvent.press(getByTestId("calendar-pressable"));
    fireEvent(getByTestId("calendar"), "onDayPress", {
      dateString: "2022-01-01",
    });

    expect(toJSON()).toMatchSnapshot();
  });

  describe("Record type selector tests", () => {
    test("Sample selected", async () => {
      const { getByTestId, queryByPlaceholderText } = await customRender();

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sample",
      );

      expect(
        queryByPlaceholderText(Placeholders.RecordScreen.TubeId),
      ).toBeTruthy();
    });

    test("Sighting selected", async () => {
      const { getByTestId, queryByPlaceholderText } = await customRender();

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sighting",
      );

      expect(
        queryByPlaceholderText(Placeholders.RecordScreen.TubeIdDisabled),
      ).toBeTruthy();
    });
  });

  describe("GPS coordinate tests", () => {
    test("with Expo.Location", async () => {
      const { getByTestId, queryByText } = await customRender();

      fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));

      // TODO: I have no way of testing if Modal is visible or not
      // these tests are always true if the modal is visible or not
      expect(queryByText(Labels.Modal.Cancel)).toBeTruthy();
      expect(queryByText(Labels.Modal.Confirm)).toBeTruthy();
    });

    test("manual with confirmation", async () => {
      const {
        getByDisplayValue,
        queryByDisplayValue,
        getByPlaceholderText,
        queryByPlaceholderText,
        getByTestId,
        getByText,
        queryByTestId,
      } = await customRender();
      const testCoordinates = "123.456, -98.765";

      fireEvent.press(getByTestId(TestIds.GPS.GpsManualEntryPressable));
      fireEvent.press(getByText(Labels.Modal.Confirm));

      return waitFor(() =>
        expect(
          queryByPlaceholderText(Placeholders.GPS.EnterCoordinates),
        ).toBeTruthy(),
      ).then(() => {
        fireEvent.changeText(
          getByPlaceholderText(Placeholders.GPS.EnterCoordinates),
          testCoordinates,
        );

        return waitFor(() =>
          expect(queryByDisplayValue(testCoordinates)).toBeTruthy(),
        ).then(() => {
          // manual coordinates modal shouldn't prompt again or reset coordinates
          // TODO: no way to test if modal is visible or not
          fireEvent.press(getByDisplayValue(testCoordinates));

          expect(
            queryByTestId(TestIds.GPS.GpsManualEntryPressable),
          ).toBeTruthy();
          expect(getByDisplayValue(testCoordinates)).toBeTruthy();
        });
      });
    });

    test("manual without confirmation", async () => {
      const { expectedCoordinates, getByDisplayValue } =
        await renderWithGpsWarningOff();

      expect(getByDisplayValue(expectedCoordinates)).toBeTruthy();
    });
  });

  describe("TextInput tests", () => {
    test("TubeId", async () => {
      const {
        getByPlaceholderText,
        getByDisplayValue,
        getByTestId,
        queryByPlaceholderText,
      } = await customRender();

      await waitFor(() =>
        queryByPlaceholderText(Placeholders.RecordScreen.TubeIdDisabled),
      );

      fireEvent(
        getByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sample",
      );

      const expected = "123-456";

      fireEvent.changeText(
        getByPlaceholderText(Placeholders.RecordScreen.TubeId),
        expected,
      );

      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(
        getByPlaceholderText(Placeholders.RecordScreen.TubeId),
        "onSubmitEditing",
      );
    });

    test("Location Description", async () => {
      const { getByPlaceholderText, getByDisplayValue } = await customRender();
      const expected = "Excelsior Pass on High Divide Trail";

      fireEvent.changeText(
        getByPlaceholderText(Placeholders.RecordScreen.LocationDescription),
        expected,
      );

      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(
        getByPlaceholderText(Placeholders.RecordScreen.LocationDescription),
        "onSubmitEditing",
      );
    });

    test("Notes", async () => {
      const { getByPlaceholderText, getByDisplayValue } = await customRender();
      const expected = "Frozen lake in a cold place with runnels of red snow";

      fireEvent.changeText(
        getByPlaceholderText(Placeholders.RecordScreen.Notes),
        expected,
      );

      expect(getByDisplayValue(expected)).not.toBeNull();
      fireEvent(
        getByPlaceholderText(Placeholders.RecordScreen.Notes),
        "onSubmitEditing",
      );
    });
  });

  // commented out because we use ExpoPhotoSelector now and not 3rd party package
  /* describe("Photo tests", () => {
    test("navigate to camera roll selection screen", () => {
      const { getByTestId } = customRender();

      navigation.navigate = jest
        .fn()
        .mockImplementationOnce((screen: string) => {
          expect(screen).toEqual("ImageSelection");
        });

      // fireEvent.press(getByTestId(TestIds.Selectors.Photos));

      // TODO: fire cancel event?

      // expect(navigation.navigate).toBeCalledTimes(1);
    });
  }); */

  // navigation header component is independent of RecordScreen component
  describe("Upload tests", () => {
    let screenTestCoordinates;
    let screenGetByTestId;
    let screenGetByDisplayValue;
    let screenGetByPlaceholderText;

    beforeEach(async () => {
      const recordScreen = await renderWithGpsWarningOff();

      screenGetByTestId = recordScreen.getByTestId;

      // TODO: figure out how set these fields via native-base
      /* fireEvent(
        screenGetByPlaceholderText(Placeholders.RecordScreen.Size),
        "onValueChange",
        "Fist"
      );

      fireEvent(
        screenGetByTestId(TestIds.Selectors.AlgaeColor),
        "onValueChange",
        "Red"
      ); */

      screenTestCoordinates = recordScreen.expectedCoordinates;
      screenGetByDisplayValue = recordScreen.getByDisplayValue;
      screenGetByPlaceholderText = recordScreen.getByPlaceholderText;
    });

    test("upload record successfully", async () => {
      const { getByTestId } = render(recordActionButton);

      /* const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce(() =>
          Promise.resolve(makeExampleRecord("Sample"))
        ); */

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: waitFor(queryByText(toast?))
      /* await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        )
      ); */

      // TODO: record doesn't pass form validations
      /* expect(navigation.goBack).toBeCalled();
      expect(uploadMock).toBeCalled(); */
    });

    test("upload sample successfully, empty fields are deleted", async () => {
      const { getByTestId } = render(recordActionButton);

      /* const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce((record: AlgaeRecord) =>
          Promise.resolve(record)
        ); */

      // simulates user entering text then deleting it
      // TODO: have to fireEvent.press(Sample since Sighting is the new default)
      /* fireEvent.changeText(
        screenGetByPlaceholderText(Placeholders.RecordScreen.TubeId),
        ""
      ); */

      fireEvent.changeText(
        screenGetByPlaceholderText(Placeholders.RecordScreen.Notes),
        "",
      );

      fireEvent.changeText(
        screenGetByPlaceholderText(
          Placeholders.RecordScreen.LocationDescription,
        ),
        "",
      );

      fireEvent(
        screenGetByTestId(TestIds.Selectors.RecordType),
        "onValueChange",
        "Sample",
      );

      // upload record
      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: waitFor(queryByText(toast?))
      /* await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        )
      ); */

      // TODO: record doesn't pass form validations
      /* expect(navigation.goBack).toBeCalled();
      expect(uploadMock).toBeCalled();
      const receivedRecord = uploadMock.mock.calls[0][0];
      expect(receivedRecord.tubeId).not.toBeDefined();
      expect(receivedRecord.notes).not.toBeDefined();
      expect(receivedRecord.locationDescription).not.toBeDefined(); */
    });

    test("upload record invalid gps user input", async () => {
      const { getByTestId } = render(recordActionButton);

      fireEvent.changeText(
        screenGetByDisplayValue(screenTestCoordinates),
        "garbage, coordinates",
      );

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: queryByText (or get, whichever one is supposed to be used in wait)
      /* await waitFor(() =>
        expect(alertMock).toBeCalledWith(
          Notifications.invalidCoordinates.title,
          Notifications.invalidCoordinates.message
        )
      ); */
    });

    test("upload record invalid algae size user input", async () => {
      const { getByTestId } = render(recordActionButton);

      // TODO: figure out how to test native-base selector
      /* fireEvent(
        screenGetByTestId(TestIds.Selectors.AlgaeSize),
        "onValueChange",
        "Select a size"
      ); */

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: queryByText
      /* await waitFor(() =>
        expect(alertMock).toBeCalledWith(Notifications.invalidAlgaeSize.title)
      ); */
    });

    test("upload record invalid algae color user input", async () => {
      const { getByTestId } = render(recordActionButton);

      /* fireEvent(
        screenGetByTestId(TestIds.Selectors.AlgaeColor),
        "onValueChange",
        "Select a color"
      ); */

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: queryByText(validations.must specify at least 1 color)
      /* await waitFor(() =>
        expect(alertMock).toBeCalledWith(Notifications.invalidAlgaeColor.title)
      ); */
    });

    test("upload record network failure", async () => {
      const { getByTestId } = render(recordActionButton);
      /* const uploadError = {
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      };

       const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockRejectedValueOnce(uploadError); */

      fireEvent.press(getByTestId(TestIds.RecordScreen.UploadButton));

      // TODO: test fails because record doesn't pass form validation
      /* return waitFor(() => expect(navigation.goBack).toBeCalled()).then(() =>
        waitFor(() => expect(uploadMock).toBeCalled())
      ); */

      // TODO: waitFor(queryByText(toast?))
      /* .then(() =>
        waitFor(() =>
          expect(alertSpy).toBeCalledWith(
            Notifications.uploadRecordFailed.title,
            Notifications.uploadRecordFailed.message
          )
        ).then(() => {
          expect(uploadMock).toBeCalled();
        })
      ); */
    });
  });

  describe("Edit mode tests", () => {
    const recordPhotos = [
      {
        width: 100,
        height: 200,
        uri: "46",
      },
      {
        width: 100,
        height: 200,
        uri: "23",
      },
    ] as Asset[];
    let record: AlgaeRecord;
    let recordScreen;

    beforeEach(async () => {
      record = makeExampleRecord("Sample");
      await PhotoManager.addSelected(record.id, recordPhotos);

      // render the Record Screen in Edit Mode
      recordScreen = await customRender({
        params: { record: JSON.stringify(record) },
      } as RecordScreenRouteProp);

      // verify the photo was "Loaded" by checking "Loading" no longer exists
      // API for "*ByAltText" doesn't exist in React Native
      await waitFor(() => {
        if (recordScreen.queryByText("Loading") != null) {
          throw new Error("image not loaded yet");
        }
      });

      // now the Record Screen has been initialized
      return Storage.savePendingRecord(record);
    }, 10000);

    test("renders", () => {
      const { toJSON } = recordScreen;

      expect(toJSON()).toMatchSnapshot();
    });

    test("update record successfully", async () => {
      const screenFindByText = recordScreen.findByText;
      const screenGetByTestId = recordScreen.getByTestId;

      fireEvent(
        screenGetByTestId(TestIds.Selectors.RecordType),
        "onChange",
        "Sighting",
      );

      // render the update button after Sample changed to Sighting
      const { getByTestId } = render(recordActionButton);
      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      record.type = "Sighting";

      // assert toast notification
      await screenFindByText(Notifications.updateRecordSuccess.title);

      // assert navigating back to Timeline
      await waitFor(() => expect(navigation.goBack).toBeCalled());

      // assert the record was updated
      const received = await Storage.loadPendingRecords();
      expect(received[0]).toEqual(record);

      // assert selected photots associated with record
      const selectedPhotos = await Storage.loadSelectedPhotos();
      const photos = selectedPhotos.get(record.id);

      if (photos != undefined) {
        expect(photos[0]).toEqual(recordPhotos[0]);
        expect(photos[1]).toEqual(recordPhotos[1]);
      } else {
        throw new Error("selected photos not found");
      }
    }, 10000);

    test("update record invalid user input", async () => {
      const screenFindByText = recordScreen.findByText;
      const screenGetByDisplayValue = recordScreen.getByDisplayValue;

      fireEvent.changeText(
        screenGetByDisplayValue(`${record.latitude}, ${record.longitude}`),
        "garbage, coordinates",
      );

      // render the update button after coordinates changed
      const { getByTestId } = render(recordActionButton);

      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      await screenFindByText(Validations.invalidCoordinates);
    });

    test("update record fails", async () => {
      const screenFindByText = recordScreen.findByText;
      const { getByTestId } = render(recordActionButton);

      jest.spyOn(Storage, "updatePendingRecord").mockRejectedValueOnce("error");

      fireEvent.press(getByTestId(TestIds.RecordScreen.UpdateButton));

      await screenFindByText(Notifications.updateRecordFailed.message);
    }, 10000);
  });
});
