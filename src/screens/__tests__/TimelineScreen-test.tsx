import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, {
  NetInfoChangeHandler,
  NetInfoState,
} from "@react-native-community/netinfo";
import TimelineScreen from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import * as RecordManager from "../../lib/RecordManager";
import { makeExampleRecord } from "../../record/Record";
import * as Storage from "../../lib/Storage";
import TestIds from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";
import { getAppSettings, setAppSettings } from "../../../AppSettings";
import { mockedNavigate } from "../../../jesttest.setup";
import { RecordReducerStateContext } from "../../hooks/useRecordReducer";
import { makeRecordReducerStateMock } from "../../mocks/useRecordReducer.mock";

// TimelineScreen takes navigation input prop
const navigation = {
  navigate: jest.fn(),
  addListener: () => () => {},
};

const downloadedRecord: AlgaeRecord = {
  ...makeExampleRecord("Sample"),
  id: 1,
};

const downloadedAtlasRecord: AlgaeRecord = {
  ...makeExampleRecord("Atlas: Red Dot"),
  id: 2,
};

const pendingRecord: AlgaeRecord = {
  ...makeExampleRecord("Sighting"),
  id: 3,
};

const pendingAtlasRecord: AlgaeRecord = {
  ...makeExampleRecord("Atlas: Blue Dot with Sample"),
  id: 4,
};

const setIsConntected = (isConnected: boolean): void => {
  jest.spyOn(NetInfo, "addEventListener").mockImplementationOnce((callback) => {
    callback({ isConnected } as NetInfoState);

    return () => {};
  });
};

const setupDownloadSuccess = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryPendingRecords")
    .mockImplementationOnce(() => Promise.resolve([]));

  const recordReducerStateMock = makeRecordReducerStateMock();

  recordReducerStateMock.downloadedRecords = [
    downloadedRecord,
    downloadedAtlasRecord,
  ];

  setIsConntected(true);

  return {
    retryRecordsSpy,
    recordReducerStateMock,
  };
};

const setupDownloadFailed = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryPendingRecords")
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
    const { retryRecordsSpy, recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId, getByText } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("download records fails", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.TimelineScreen.ExampleRecords));
    expect(retryRecordsSpy).toBeCalledTimes(1);
  });

  test("pending records", async () => {
    const retryRecordsSpy = setupDownloadFailed();

    /* eslint-disable react/jsx-no-constructed-context-values */
    const recordReducerStateMock: RecordReducerState = {
      ...makeRecordReducerStateMock(),
      pendingRecords: [pendingRecord, pendingAtlasRecord],
    };

    const { getByTestId, getByText } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    // non-atlas visible
    await waitFor(() => getByTestId(pendingRecord.id.toString()));
    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

    // atlas visible
    expect(getByTestId(pendingAtlasRecord.id.toString())).toBeTruthy();
  });

  test("delete pending record", () => {
    // validates a bug where pending records were not displayed when not connected
    setIsConntected(false);
    let okPressed = false;
    const alertMock = jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) => {
        // @ts-ignore
        buttons[0].onPress(); // "Yes" button
        okPressed = true;
      });

    /* eslint-disable react/jsx-no-constructed-context-values */
    const recordReducerStateMock: RecordReducerState = {
      ...makeRecordReducerStateMock(),
      pendingRecords: [pendingRecord],
    };

    const { getByTestId, getByText } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));

    return waitFor(() => expect(okPressed).toBe(true)).then(() =>
      Storage.loadPendingRecords().then((received) => {
        expect(received).toEqual([]);
        expect(alertMock).toBeCalledTimes(1);
      })
    );
  });

  describe("atlas scenarios", () => {
    let prevAppSettings: AppSettings;

    beforeEach(() => {
      prevAppSettings = getAppSettings();
    });

    afterEach(() => setAppSettings(prevAppSettings));

    test("non-atlas and atlas records are displayed", async () => {
      const { retryRecordsSpy, recordReducerStateMock } =
        setupDownloadSuccess();

      setAppSettings((prev) => ({
        ...prev,
        showAtlasRecords: true,
        showOnlyAtlasRecords: false,
      }));

      const { getByTestId, getByText } = render(
        <RecordReducerStateContext.Provider value={recordReducerStateMock}>
          <TimelineScreen navigation={navigation} />
        </RecordReducerStateContext.Provider>
      );

      // non-atlas visible
      await waitFor(() => getByTestId(downloadedRecord.id.toString()));

      expect(retryRecordsSpy).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

      // atlas visible
      expect(getByTestId(downloadedAtlasRecord.id.toString())).toBeTruthy();
    });

    test("atlas records are not displayed", async () => {
      const { retryRecordsSpy, recordReducerStateMock } =
        setupDownloadSuccess();

      setAppSettings((prev) => ({
        ...prev,
        showAtlasRecords: false,
        showOnlyAtlasRecords: false,
      }));

      const { getByTestId, getByText, queryByTestId } = render(
        <RecordReducerStateContext.Provider value={recordReducerStateMock}>
          <TimelineScreen navigation={navigation} />
        </RecordReducerStateContext.Provider>
      );

      // non-atlas visible
      await waitFor(() => getByTestId(downloadedRecord.id.toString()));

      expect(retryRecordsSpy).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

      // atlas not visible
      expect(queryByTestId(downloadedAtlasRecord.id.toString())).toBeFalsy();
    });

    test("only atlas records are displayed", async () => {
      const { retryRecordsSpy, recordReducerStateMock } =
        setupDownloadSuccess();

      setAppSettings((prev) => ({
        ...prev,
        showAtlasRecords: true,
        showOnlyAtlasRecords: true,
      }));

      const { getByTestId, getByText, queryByTestId } = render(
        <RecordReducerStateContext.Provider value={recordReducerStateMock}>
          <TimelineScreen navigation={navigation} />
        </RecordReducerStateContext.Provider>
      );

      // atlas visible
      await waitFor(() => getByTestId(downloadedAtlasRecord.id.toString()));

      expect(retryRecordsSpy).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

      // non-atlas not visible
      expect(queryByTestId(downloadedRecord.id.toString())).toBeFalsy();
    });
  });

  test("connection lost", async () => {
    setIsConntected(false);
    const { getByText } = render(<TimelineScreen navigation={navigation} />);

    await waitFor(() => getByText(Labels.StatusBar.NoConnection));
    expect(getByText(Labels.StatusBar.NoConnection)).toBeTruthy();
  });

  test("connection restored", async () => {
    let cacheCallback: NetInfoChangeHandler;

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
    const { recordReducerStateMock } = setupDownloadSuccess();

    const { getByText, getByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));
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

    const { getByText, getByTestId } = render(
      <TimelineScreen navigation={navigation} />
    );

    // GO GO RNTL! "don't test the implementation..."
    await act(async () =>
      getByTestId(
        TestIds.TimelineScreen.RefreshControl
      ).props.refreshControl.props.onRefresh()
    );

    expect(getByText(Labels.TimelineScreen.ExampleRecords)).toBeTruthy();
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
    const { retryRecordsSpy, recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    fireEvent.press(getByTestId(downloadedRecord.id.toString()));

    expect(retryRecordsSpy).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith("RecordDetails", {
      record: downloadedRecord,
    });
  });
});
