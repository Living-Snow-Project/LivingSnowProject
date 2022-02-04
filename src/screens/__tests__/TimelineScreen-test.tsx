import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import TimelineScreen from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import RecordManager from "../../lib/RecordManager";
import Storage from "../../lib/Storage";
import { Network } from "../../lib/Network";
import TestIds from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";
import { AppSettings, setAppSettings } from "../../../AppSettings";

// TimelineScreen takes navigation input prop
const navigation = {
  navigate: jest.fn(),
  addListener: () => () => {},
};

// TimelineRow calls useNavigation
const mockedNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

// TODO: concept of "Example Record" used in testing and also used in App for "first run"
const sharedTestRecordProps = {
  id: "1234",
  type: "Sample",
  name: "test name",
  date: "2021-09-16T00:00:00",
  organization: "test org",
  latitude: "-123.456",
  longitude: "96.96",
  tubeId: null,
  locationDescription: "test location",
  notes: "test notes",
  atlasType: 0,
  photoUris: "46;23;",
};

// BUGBUG: can downloaded and saved/pending records have consistent structure (photoUris)?
const downloadedTestRecord = {
  ...sharedTestRecordProps,
};

const downloadedAtlasTestRecord = {
  ...sharedTestRecordProps,
  type: "AtlasRedDot",
};

const makePendingTestRecord = () => ({
  ...sharedTestRecordProps,
  photoUris: [{ uri: "" }],
});

const setIsConntected = (isConnected: boolean): void => {
  jest.spyOn(NetInfo, "addEventListener").mockImplementationOnce((callback) => {
    callback({ isConnected } as NetInfoState);

    return () => {};
  });
};

const setupDownloadSuccess = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryRecords")
    .mockImplementationOnce(() => Promise.resolve());

  const retryPhotosSpy = jest
    .spyOn(RecordManager, "retryPhotos")
    .mockImplementationOnce(() => Promise.resolve());

  const downloadRecordsSpy = jest
    .spyOn(Network, "downloadRecords")
    .mockImplementationOnce(() =>
      Promise.resolve([downloadedTestRecord, downloadedAtlasTestRecord])
    );

  setIsConntected(true);

  return {
    retryRecordsSpy,
    retryPhotosSpy,
    downloadRecordsSpy,
  };
};

const setupDownloadFailed = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryRecords")
    .mockImplementationOnce(() => Promise.reject());

  setIsConntected(true);

  return retryRecordsSpy;
};

describe("TimelineScreen test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders", () => {
    const { toJSON } = render(<TimelineScreen navigation={navigation} />);
    expect(toJSON()).toMatchSnapshot();
  });

  test("download records succeeds", async () => {
    const { retryRecordsSpy, retryPhotosSpy, downloadRecordsSpy } =
      setupDownloadSuccess();

    setAppSettings({
      showAtlasRecords: true,
      showOnlyAtlasRecords: true,
    } as AppSettings);

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(downloadedTestRecord.id));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(retryPhotosSpy).toBeCalledTimes(1);
    expect(downloadRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    setAppSettings({
      showAtlasRecords: false,
      showOnlyAtlasRecords: false,
    } as AppSettings);
  });

  test("download records fails", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.TimelineScreen.NoRecords));
    expect(retryRecordsSpy).toBeCalledTimes(1);
  });

  test("pending records", async () => {
    const retryRecordsSpy = setupDownloadFailed();
    const originalLoadRecords = Storage.loadRecords;
    Storage.loadRecords = () => Promise.resolve([makePendingTestRecord()]);

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(sharedTestRecordProps.id));
    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

    Storage.loadRecords = originalLoadRecords;
  });

  test("connection lost", async () => {
    setIsConntected(false);
    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.StatusBar.NoConnection));
    expect(getByText(Labels.StatusBar.NoConnection)).toBeTruthy();
  });

  test("connection restored", async () => {
    let cacheCallback;

    jest
      .spyOn(NetInfo, "addEventListener")
      .mockImplementationOnce((callback) => {
        cacheCallback = callback;
        callback({ isConnected: false } as NetInfoState);
        return () => {};
      });

    const { getByText, queryByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByText(Labels.StatusBar.NoConnection));
    expect(getByText(Labels.StatusBar.NoConnection)).toBeTruthy();

    await act(async () => cacheCallback({ isConnected: true } as NetInfoState));
    expect(queryByText(Labels.StatusBar.NoConnection)).toBeFalsy();
  });

  test("pull to refresh with connection", async () => {
    setupDownloadSuccess();

    const { getByText, getByTestId } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(downloadedTestRecord.id));
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    await act(async () =>
      getByTestId(
        TestIds.TimelineScreen.RefreshControl
      ).props.refreshControl.props.onRefresh()
    );

    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("pull to refresh without connection", async () => {
    setIsConntected(false);

    const { getByTestId } = render(<TimelineScreen navigation={navigation} />);

    // GO GO RNTL! "don't test the implementation..."
    await act(async () =>
      getByTestId(
        TestIds.TimelineScreen.RefreshControl
      ).props.refreshControl.props.onRefresh()
    );

    // nothing to assert, strictly for code coverage
    // TODO: re-evaluate setPendingRecords initialization and displaySavedRecords()
  });

  test("navigate back to TimelineScreen", async () => {
    let cb;
    const localNavigation = {
      navigate: jest.fn(),
      addListener: (event: string, callback: () => void) => {
        expect(event).toEqual("focus");
        cb = callback;
      },
    };

    render(<TimelineScreen navigation={localNavigation} />);
    await waitFor(() => expect(cb).not.toBeUndefined());
    await act(async () => cb());
  });

  test("navigate to SettingsScreen", () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<SettingsButton navigate={navigate} />);
    fireEvent.press(getByTestId(TestIds.TimelineScreen.SettingsButton));
    expect(navigate).toBeCalledWith("Settings");
  });

  test("navigate to RecordScreen", async () => {
    const navigate = jest.fn();
    const { getByTestId } = render(<NewRecordButton navigate={navigate} />);
    fireEvent.press(getByTestId(TestIds.TimelineScreen.NewRecordButton));
    expect(navigate).toBeCalledWith("Record");
  });

  test("navigate to record details screen", async () => {
    const { retryRecordsSpy, retryPhotosSpy, downloadRecordsSpy } =
      setupDownloadSuccess();

    const { getByTestId } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByTestId(downloadedTestRecord.id));

    fireEvent.press(getByTestId(downloadedTestRecord.id));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(retryPhotosSpy).toBeCalledTimes(1);
    expect(downloadRecordsSpy).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith(
      "RecordDetails",
      downloadedTestRecord
    );
  });
});
