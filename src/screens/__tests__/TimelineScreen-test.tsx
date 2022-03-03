import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import TimelineScreen from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import * as RecordManager from "../../lib/RecordManager";
import { makeExampleRecord } from "../../record/Record";
import * as Storage from "../../lib/Storage";
import * as Network from "../../lib/Network";
import TestIds from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";
import { setAppSettings } from "../../../AppSettings";
import { mockedNavigate } from "../../../jesttest.setup";

// TimelineScreen takes navigation input prop
const navigation = {
  navigate: jest.fn(),
  addListener: () => () => {},
};

const downloadedTestRecord: AlgaeRecord = makeExampleRecord("Sample");
const downloadedAtlasTestRecord: AlgaeRecord =
  makeExampleRecord("Atlas: Red Dot");
const pendingTestRecord: AlgaeRecord = makeExampleRecord("Sighting");

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

  const downloadRecordsSpy = jest
    .spyOn(Network, "downloadRecords")
    .mockImplementationOnce(() =>
      Promise.resolve([downloadedTestRecord, downloadedAtlasTestRecord])
    );

  setIsConntected(true);

  return {
    retryRecordsSpy,
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
    const { retryRecordsSpy, downloadRecordsSpy } = setupDownloadSuccess();

    // TODO: isolate to different test case, exists here now for code coverage reasons
    // ie. this assertion is "buried" and not easily discoverable
    setAppSettings((prev) => ({
      ...prev,
      showAtlasRecords: true,
      showOnlyAtlasRecords: true,
    }));

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(downloadedTestRecord.id.toString()));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(downloadRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    setAppSettings((prev) => ({
      ...prev,
      showAtlasRecords: false,
      showOnlyAtlasRecords: false,
    }));
  });

  test("download records fails", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.TimelineScreen.NoRecords));
    expect(retryRecordsSpy).toBeCalledTimes(1);
  });

  test("pending records", async () => {
    const retryRecordsSpy = setupDownloadFailed();
    jest
      .spyOn(Storage, "loadRecords")
      .mockImplementationOnce(() => Promise.resolve([pendingTestRecord]));

    const { getByTestId, getByText } = render(
      <TimelineScreen navigation={navigation} />
    );

    await waitFor(() => getByTestId(pendingTestRecord.id.toString()));
    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();
  });

  test.todo("non-atlas and atlas records are displayed");
  test.todo("atlas records are not displayed");
  test.todo("only atlas records are displayed");

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

    await waitFor(() => getByTestId(downloadedTestRecord.id.toString()));
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
    let cb: () => void;
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
    const { retryRecordsSpy, downloadRecordsSpy } = setupDownloadSuccess();

    const { getByTestId } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByTestId(downloadedTestRecord.id.toString()));

    fireEvent.press(getByTestId(downloadedTestRecord.id.toString()));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(downloadRecordsSpy).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith("RecordDetails", {
      record: downloadedTestRecord,
    });
  });
});
