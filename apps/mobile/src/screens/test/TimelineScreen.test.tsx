import React from "react";
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
import { TimelineScreen } from "../TimelineScreen";
import {
  SettingsButton,
  NewRecordButton,
} from "../../navigation/MainTabNavigator";
import { Labels, TestIds } from "../../constants";
import {
  NativeBaseProviderForTesting,
  mockedNavigate,
} from "../../../jesttest.setup";
import { AlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { makeAlgaeRecordsMock } from "../../mocks/useAlgaeRecords.mock";

// TimelineScreen takes navigation input prop
const navigation = {} as TimelineScreenNavigationProp;
navigation.navigate = jest.fn();
navigation.addListener = jest.fn();

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
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  test("download records succeeds", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId, getByText } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    expect(algaeRecords.fullSync).toBeCalledTimes(1);
    expect(getByText(Labels.TimelineScreen.DownloadedRecords)).toBeTruthy();
  });

  test("download records fails", async () => {
    const recordReducerActionsMock = setupDownloadFailed();

    const { getByText } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={recordReducerActionsMock}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.TimelineScreen.ExampleRecords));
    expect(recordReducerActionsMock.fullSync).toBeCalledTimes(1);
  });

  test("connection lost", async () => {
    setIsConnected(false);
    const { getByText } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={makeAlgaeRecordsMock()}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
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
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={makeAlgaeRecordsMock()}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.StatusBar.NoConnection));
    expect(getByText(Labels.StatusBar.NoConnection)).toBeTruthy();

    await act(async () => cacheCallback({ isConnected: true } as NetInfoState));
    expect(queryByText(Labels.StatusBar.NoConnection)).toBeFalsy();
  });

  test("pull to refresh with connection", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByText, getByTestId } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
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
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider
          value={makeAlgaeRecordsMock({ isEmpty: true })}
        >
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
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
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
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

  test("navigate to SettingsScreen", () => {
    const navigationInner = {} as RootStackNavigationProp;
    navigationInner.navigate = jest.fn();

    const { getByTestId } = render(
      <NativeBaseProviderForTesting>
        <SettingsButton navigation={navigationInner} />
      </NativeBaseProviderForTesting>
    );

    fireEvent.press(getByTestId(TestIds.TimelineScreen.SettingsButton));

    expect(navigationInner.navigate).toBeCalledWith("Settings");
  });

  test("navigate to RecordScreen", async () => {
    const navigationInner = {} as RootStackNavigationProp;
    navigationInner.navigate = jest.fn();

    const { getByTestId } = render(
      <NativeBaseProviderForTesting>
        <NewRecordButton navigation={navigationInner} />
      </NativeBaseProviderForTesting>
    );

    fireEvent.press(getByTestId(TestIds.TimelineScreen.NewRecordButton));

    expect(navigationInner.navigate).toBeCalledWith("Record");
  });

  test("navigate to RecordDetailsScreen", async () => {
    const algaeRecords = setupDownloadSuccess();

    const { getByTestId } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByTestId(downloadedRecord.id.toString()));

    fireEvent.press(getByTestId(downloadedRecord.id.toString()));

    expect(algaeRecords.fullSync).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith("RecordDetails", {
      record: JSON.stringify(downloadedRecord),
    });
  });

  describe("Pending records tests", () => {
    /* const algaeRecords = makeAlgaeRecordsMock();
    const customRender = () => {
      const renderResult = render(
        <NativeBaseProviderForTesting>
          <AlgaeRecordsContext.Provider value={algaeRecords}>
            <TimelineScreen navigation={navigation} />
          </AlgaeRecordsContext.Provider>
        </NativeBaseProviderForTesting>
      );

      return {
        renderResult,
      };
    }; */

    test("pending records render", async () => {
      const algaeRecordsInner = setupDownloadFailed();

      algaeRecordsInner.getPendingRecords = () => [pendingRecord];

      const { getByTestId, getByText } = render(
        <NativeBaseProviderForTesting>
          <AlgaeRecordsContext.Provider value={algaeRecordsInner}>
            <TimelineScreen navigation={navigation} />
          </AlgaeRecordsContext.Provider>
        </NativeBaseProviderForTesting>
      );

      // visible
      await waitFor(() => getByTestId(pendingRecord.id.toString()));
      expect(algaeRecordsInner.fullSync).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();
    });

    /* test("delete pending record", () => {
      // validates a bug where pending records were not displayed when not connected
      setIsConnected(false);

      const { getByTestId, getByText } = customRender().renderResult;

      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

      // TODO: fireEvent.press(drop down menu)
      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));

      // TODO: fireEvent.press(Confirm)
      /* return waitFor(() => expect(okPressed).toBe(true)).then(() =>
        Storage.loadPendingRecords().then((received) => {
          expect(received).toEqual([]);
          expect(alertMock).toBeCalledTimes(1);
        })
      ); 
    }); */

    /* test("cancel delete record", () => {
      const { getByTestId } = customRender().renderResult;

      // TODO: fireEvent.press(drop down menu)
      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
      // TODO: fireEvent.press(Cancel)
    });

    test("edit record", () => {
      const { renderResult } = customRender();

      // TODO: fireEvent.press(drop down menu)
      fireEvent.press(
        renderResult.getByTestId(TestIds.RecordList.EditRecordAction)
      );

      expect(navigation.navigate).toBeCalledWith("Record", {
        record: JSON.stringify(algaeRecords.getPendingRecords()[0]),
      });
    }); */
  });
});
