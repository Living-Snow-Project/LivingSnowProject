import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, {
  NetInfoChangeHandler,
  NetInfoState,
} from "@react-native-community/netinfo";
import { AlgaeRecord, makeExampleRecord } from "@livingsnow/record";
import {
  RootStackNavigationProp,
  TimelineScreenNavigationProp,
} from "../../navigation/Routes";
import TimelineScreen from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import * as Storage from "../../lib/Storage";
import TestIds from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";
import { mockedNavigate } from "../../../jesttest.setup";
import { AlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import makeAlgaeRecordsMock from "../../mocks/useAlgaeRecords.mock";

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
  const algaeRecords = makeAlgaeRecordsMock();

  algaeRecords.getDownloadedRecords = () => [
    downloadedRecord,
    makeExampleRecord("Sighting"),
  ];

  setIsConnected(true);

  return algaeRecords;
};

const setupDownloadFailed = () => {
  const algaeRecords = makeAlgaeRecordsMock({
    isEmpty: true,
  });
  algaeRecords.retryPendingRecords = jest.fn(() => Promise.reject());

  setIsConnected(true);

  return algaeRecords;
};

describe("TimelineScreen test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders", () => {
    const algaeRecords = makeAlgaeRecordsMock({
      isEmpty: true,
    });
    const { toJSON } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  test("download records succeeds", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId, getByText } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    expect(algaeRecords.retryPendingRecords).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("download records fails", async () => {
    const recordReducerActionsMock = setupDownloadFailed();

    const { getByText } = render(
      <AlgaeRecordsContext.Provider value={recordReducerActionsMock}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() => getByText(Labels.TimelineScreen.ExampleRecords));
    expect(recordReducerActionsMock.retryPendingRecords).toBeCalledTimes(1);
  });

  test("connection lost", async () => {
    setIsConnected(false);
    const { getByText } = render(
      <AlgaeRecordsContext.Provider value={makeAlgaeRecordsMock()}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

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
      <AlgaeRecordsContext.Provider value={makeAlgaeRecordsMock()}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() => getByText(Labels.StatusBar.NoConnection));
    expect(getByText(Labels.StatusBar.NoConnection)).toBeTruthy();

    await act(async () => cacheCallback({ isConnected: true } as NetInfoState));
    expect(queryByText(Labels.StatusBar.NoConnection)).toBeFalsy();
  });

  test("pull to refresh with connection", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByText, getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
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
      <AlgaeRecordsContext.Provider
        value={makeAlgaeRecordsMock({ isEmpty: true })}
      >
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onRefresh()
    );

    expect(getByText(Labels.TimelineScreen.ExampleRecords)).toBeTruthy();
  });

  test("onEndReached download records", async () => {
    const algaeRecords = makeAlgaeRecordsMock();

    algaeRecords.getDownloadedRecords = () => [downloadedRecord];

    const { getByText, getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
    );
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();

    await act(async () =>
      getByTestId(TestIds.TimelineScreen.FlatList).props.onEndReached()
    );

    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("record flatlist onLayout", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
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
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
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
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId, queryByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
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
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloadedRecords()[0].id.toString())
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

  test("navigate to RecordDetailsScreen", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId } = render(
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <TimelineScreen navigation={navigation} />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    fireEvent.press(getByTestId(downloadedRecord.id.toString()));

    expect(algaeRecords.retryPendingRecords).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith("RecordDetails", {
      record: downloadedRecord,
    });
  });

  describe("Pending records tests", () => {
    const algaeRecords = makeAlgaeRecordsMock();
    const customRender = () => {
      const renderResult = render(
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      );

      return {
        renderResult,
      };
    };

    test("pending records render", async () => {
      const algaeRecordsInner = setupDownloadFailed();

      algaeRecordsInner.getPendingRecords = () => [pendingRecord];

      const { getByTestId, getByText } = render(
        <AlgaeRecordsContext.Provider value={algaeRecordsInner}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      );

      // visible
      await waitFor(() => getByTestId(pendingRecord.id.toString()));
      expect(algaeRecordsInner.retryPendingRecords).toBeCalledTimes(1);
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
      const { renderResult } = customRender();

      fireEvent.press(
        renderResult.getByTestId(TestIds.RecordList.EditRecordAction)
      );

      expect(navigation.navigate).toBeCalledWith("Record", {
        record: algaeRecords.getPendingRecords()[0],
      });
    });
  });
});
