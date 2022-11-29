import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, {
  NetInfoChangeHandler,
  NetInfoState,
} from "@react-native-community/netinfo";
import { AlgaeRecord, makeExampleRecord } from "@livingsnow/record";
import { RecordReducerState } from "../../../types/AlgaeRecords";
import {
  RootStackNavigationProp,
  TimelineScreenNavigationProp,
} from "../../navigation/Routes";
import TimelineScreen from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import * as RecordManager from "../../lib/RecordManager";
import * as Storage from "../../lib/Storage";
import TestIds from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";
import { mockedNavigate } from "../../../jesttest.setup";
import {
  RecordReducerActionsContext,
  RecordReducerStateContext,
} from "../../hooks/useAlgaeRecords";
import {
  makeRecordReducerActionsMock,
  makeRecordReducerStateMock,
} from "../../mocks/useRecordReducer.mock";

// TimelineScreen takes navigation input prop
const navigation = {} as TimelineScreenNavigationProp;
navigation.navigate = jest.fn();

const downloadedRecord: AlgaeRecord = {
  ...makeExampleRecord("Sample"),
  id: 1,
};

const pendingRecord: AlgaeRecord = {
  ...makeExampleRecord("Sighting"),
  id: 3,
};

const setIsConnected = (isConnected: boolean): void => {
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
    makeExampleRecord("Sighting"),
  ];

  setIsConnected(true);

  return {
    retryRecordsSpy,
    recordReducerStateMock,
  };
};

const setupDownloadFailed = () => {
  const retryRecordsSpy = jest
    .spyOn(RecordManager, "retryPendingRecords")
    .mockImplementationOnce(() => Promise.reject());

  setIsConnected(true);

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

  test("connection lost", async () => {
    setIsConnected(false);
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

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onRefresh()
    );

    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("pull to refresh without connection", async () => {
    setIsConnected(false);

    const { getByText, getByTestId } = render(
      <TimelineScreen navigation={navigation} />
    );

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onRefresh()
    );

    expect(getByText(Labels.TimelineScreen.ExampleRecords)).toBeTruthy();
  });

  test("onEndReached download records", async () => {
    /* eslint-disable react/jsx-no-constructed-context-values */
    const recordReducerStateMock = {
      ...makeRecordReducerStateMock(),
      downloadedRecords: [downloadedRecord],
    };
    const recordReducerActionsMock = makeRecordReducerActionsMock();

    const { getByText, getByTestId } = render(
      <RecordReducerActionsContext.Provider value={recordReducerActionsMock}>
        <RecordReducerStateContext.Provider value={recordReducerStateMock}>
          <TimelineScreen navigation={navigation} />
        </RecordReducerStateContext.Provider>
      </RecordReducerActionsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onEndReached()
    );

    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("record flatlist onLayout", async () => {
    const { recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );

    fireEvent(getByTestId(TestIds.TimelineScreen.RecordListView), "onLayout", {
      nativeEvent: {
        layout: {
          width: 600,
          height: 1000,
        },
      },
    });
  });

  test("onScroll shows scrollToTop", async () => {
    const { recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onScroll({
        nativeEvent: {
          contentSize: {
            height: 1200,
          },
          layoutMeasurement: {
            height: 1200,
          },
          contentOffset: {
            y: 1001,
          },
        },
      })
    );

    expect(getByTestId(TestIds.TimelineScreen.ScrollToTopButton)).toBeTruthy();
  });

  test("onScroll doesn't show scrollToTop", async () => {
    const { recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId, queryByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onScroll({
        nativeEvent: {
          contentSize: {
            height: 1200,
          },
          layoutMeasurement: {
            height: 1200,
          },
          contentOffset: {
            y: 999,
          },
        },
      })
    );

    expect(queryByTestId(TestIds.TimelineScreen.ScrollToTopButton)).toBeFalsy();
  });

  test("scrollToTop", async () => {
    const { recordReducerStateMock } = setupDownloadSuccess();

    const { getByTestId } = render(
      <RecordReducerStateContext.Provider value={recordReducerStateMock}>
        <TimelineScreen navigation={navigation} />
      </RecordReducerStateContext.Provider>
    );

    await waitFor(() =>
      getByTestId(recordReducerStateMock.downloadedRecords[0].id.toString())
    );

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onScroll({
        nativeEvent: {
          contentSize: {
            height: 1200,
          },
          layoutMeasurement: {
            height: 1200,
          },
          contentOffset: {
            y: 1001,
          },
        },
      })
    );

    fireEvent.press(getByTestId(TestIds.TimelineScreen.ScrollToTopButton));
  });

  test("navigate to SettingsScreen", () => {
    const navigationInner = {} as RootStackNavigationProp;
    navigationInner.navigate = jest.fn();

    const { getByTestId } = render(
      <SettingsButton navigation={navigationInner} />
    );
    fireEvent.press(getByTestId(TestIds.TimelineScreen.SettingsButton));
    expect(navigationInner.navigate).toBeCalledWith("Settings");
  });

  test("navigate to RecordScreen", async () => {
    const navigationInner = {} as RootStackNavigationProp;
    navigationInner.navigate = jest.fn();

    const { getByTestId } = render(
      <NewRecordButton navigation={navigationInner} />
    );
    fireEvent.press(getByTestId(TestIds.TimelineScreen.NewRecordButton));
    expect(navigationInner.navigate).toBeCalledWith("Record");
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

  describe("Pending records tests", () => {
    const recordReducerActionsMock = makeRecordReducerActionsMock();
    const customRender = () => {
      // comes with a single pending record
      const recordReducerStateMock = makeRecordReducerStateMock();
      const renderResult = render(
        <RecordReducerStateContext.Provider value={recordReducerStateMock}>
          <RecordReducerActionsContext.Provider
            value={recordReducerActionsMock}
          >
            <TimelineScreen navigation={navigation} />
          </RecordReducerActionsContext.Provider>
        </RecordReducerStateContext.Provider>
      );

      return {
        renderResult,
        recordReducerStateMock,
      };
    };

    test("pending records render", async () => {
      const retryRecordsSpy = setupDownloadFailed();

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

      // visible
      await waitFor(() => getByTestId(pendingRecord.id.toString()));
      expect(retryRecordsSpy).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();
    });

    test("delete pending record", () => {
      // validates a bug where pending records were not displayed when not connected
      setIsConnected(false);
      let okPressed = false;
      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message, buttons) => {
          // @ts-ignore
          buttons[0].onPress(); // "Yes" button
          okPressed = true;
        });

      const { getByTestId, getByText } = customRender().renderResult;

      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));

      return waitFor(() => expect(okPressed).toBe(true)).then(() =>
        Storage.loadPendingRecords().then((received) => {
          expect(received).toEqual([]);
          expect(alertMock).toBeCalledTimes(1);
        })
      );
    });

    test("cancel delete record", () => {
      const noButtonMock = jest.fn();
      const alertMock = jest
        .spyOn(Alert, "alert")
        .mockImplementationOnce((title, message, buttons) => {
          // @ts-ignore
          noButtonMock(buttons[1]); // "No" button
        });

      const { getByTestId } = customRender().renderResult;

      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
      expect(alertMock).toBeCalledTimes(1);
      expect(noButtonMock).toHaveBeenLastCalledWith({
        onPress: expect.any(Function),
        text: "No",
        style: "cancel",
      });
    });

    test("edit record", () => {
      const { recordReducerStateMock, renderResult } = customRender();

      fireEvent.press(
        renderResult.getByTestId(TestIds.RecordList.EditRecordAction)
      );

      expect(navigation.navigate).toBeCalledWith("Record", {
        record: recordReducerStateMock.pendingRecords[0],
      });
    });
  });
});
