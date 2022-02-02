import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
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
};

// BUGBUG: can downloaded and saved records have consistent structure?
const downloadedTestRecord = {
  ...sharedTestRecordProps,
  photoUris: "46;23;",
};

const savedTestRecord = {
  ...sharedTestRecordProps,
  photoUris: [{ uri: "" }],
};

const setupDownloadSucces = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryRecords")
    .mockImplementationOnce(() => Promise.resolve());

  const retryPhotosSpy = jest
    .spyOn(RecordManager, "retryPhotos")
    .mockImplementationOnce(() => Promise.resolve());

  const downloadRecordsSpy = jest
    .spyOn(Network, "downloadRecords")
    .mockImplementationOnce(() => Promise.resolve([downloadedTestRecord]));

  jest.spyOn(NetInfo, "addEventListener").mockImplementationOnce((callback) => {
    callback({ isConnected: true } as NetInfoState);

    return () => {};
  });

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

  jest.spyOn(NetInfo, "addEventListener").mockImplementationOnce((callback) => {
    callback({ isConnected: true } as NetInfoState);

    return () => {};
  });

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
      setupDownloadSucces();

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(downloadedTestRecord.id));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(retryPhotosSpy).toBeCalledTimes(1);
    expect(downloadRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("download records fails", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.TimelineScreen.NoRecords));
    expect(retryRecordsSpy).toBeCalledTimes(1);
  });

  test("pending records", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    const prevLoadRecords = Storage.loadRecords;
    Storage.loadRecords = () => Promise.resolve([savedTestRecord]);

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(savedTestRecord.id));
    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();
    Storage.loadRecords = prevLoadRecords;
  });

  test.todo("offline mode");
  test.todo("connection restored");
  test.todo("pull to refresh");
  test.todo("scrolling");
  test.todo("navigate back to TimelineScreen");

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
      setupDownloadSucces();

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
