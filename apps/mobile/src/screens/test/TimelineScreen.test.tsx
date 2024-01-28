import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import NetInfo, {
  NetInfoChangeHandler,
  NetInfoState,
} from "@react-native-community/netinfo";
import { makeExampleRecord } from "@livingsnow/record";
import { DataResponseV2 } from "@livingsnow/network";
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

jest.useFakeTimers();

// TimelineScreen takes navigation input prop
const navigation = {} as TimelineScreenNavigationProp;
navigation.navigate = jest.fn();
navigation.addListener = jest.fn();

const downloadedRecord = {
  ...makeExampleRecord("Sample", "1"),
};

const pendingRecord = {
  ...makeExampleRecord("Sighting", "3"),
};

const setIsConnected = (isConnected: boolean): void => {
  jest.spyOn(NetInfo, "addEventListener").mockImplementationOnce((callback) => {
    callback({ isConnected } as NetInfoState);

    return () => {};
  });
};

const setupDownloadSuccess = () => {
  const algaeRecords = makeAlgaeRecordsMock();

  algaeRecords.getDownloaded = () => [
    { ...downloadedRecord, photos: {} },
    { ...makeExampleRecord("Sighting"), photos: {} },
  ];

  setIsConnected(true);

  return algaeRecords;
};

const setupDownloadFailed = () => {
  const algaeRecords = makeAlgaeRecordsMock({
    isEmpty: true,
  });

  algaeRecords.retryPending = jest.fn(() => Promise.reject());

  setIsConnected(true);

  return algaeRecords;
};

describe("TimelineScreen test suite", () => {
  test("renders", async () => {
    const algaeRecords = makeAlgaeRecordsMock({
      isEmpty: true,
    });

    setIsConnected(true);

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText("Idle"));

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

    await waitFor(() => getByTestId(downloadedRecord.id));

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
      getByTestId(algaeRecords.getDownloaded()[0].id.toString())
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

    const original = algaeRecords.getDownloaded;
    algaeRecords.getDownloaded = () => [{ ...downloadedRecord, photos: {} }];

    const { getByText, getByTestId } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <TimelineScreen navigation={navigation} />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText("No Internet Connection"));

    await waitFor(() =>
      getByTestId(algaeRecords.getDownloaded()[0].id.toString())
    );

    await act(async () => {
      const { props } = await waitFor(() =>
        getByTestId(TestIds.TimelineScreen.FlatList)
      );

      await props.onEndReached();
      await waitFor(() => getByText(Labels.TimelineScreen.DownloadedRecords));
    });

    algaeRecords.getDownloaded = original;
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

    await waitFor(() => getByTestId(downloadedRecord.id));

    fireEvent.press(getByTestId(downloadedRecord.id));

    // TimelineRow is called with either DataResponseV2 or MinimalAlgaeRecord depending on if Downloaded or Pending
    // for Pending, expected type is MinimalAlgaeRecord type
    const expected: DataResponseV2 = {
      ...downloadedRecord,
      photos: {},
    };

    expect(algaeRecords.fullSync).toBeCalledTimes(1);
    expect(mockedNavigate).toBeCalledWith("RecordDetails", {
      record: JSON.stringify({ record: expected }),
    });

    mockedNavigate.mockClear();
  });

  describe("Pending records tests", () => {
    const algaeRecords = makeAlgaeRecordsMock();
    const customRender = () => {
      const renderResult = render(
        <NativeBaseProviderForTesting>
          <AlgaeRecordsContext.Provider value={algaeRecords}>
            <TimelineScreen navigation={navigation} />
          </AlgaeRecordsContext.Provider>
        </NativeBaseProviderForTesting>
      );

      return renderResult;
    };

    test("pending records render", async () => {
      const algaeRecordsInner = setupDownloadFailed();

      algaeRecordsInner.getPending = () => [
        { record: pendingRecord, photos: [] },
      ];

      const { getByTestId, getByText } = render(
        <NativeBaseProviderForTesting>
          <AlgaeRecordsContext.Provider value={algaeRecordsInner}>
            <TimelineScreen navigation={navigation} />
          </AlgaeRecordsContext.Provider>
        </NativeBaseProviderForTesting>
      );

      // visible
      await waitFor(() => getByTestId(pendingRecord.id));
      expect(algaeRecordsInner.fullSync).toBeCalledTimes(1);
      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();
    });

    test("delete pending record", async () => {
      setIsConnected(false);

      const { getByTestId, getByText } = customRender();

      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

      fireEvent.press(getByTestId(TestIds.RecordList.MenuTrigger));
      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));

      expect(getByText("Confirm Delete")).toBeTruthy();
      fireEvent.press(getByTestId(TestIds.Modal.ConfirmButton));

      expect(algaeRecords.delete).toBeCalledTimes(1);
    });

    test("cancel delete record", () => {
      setIsConnected(false);

      const { getByTestId, getByText } = customRender();

      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

      fireEvent.press(getByTestId(TestIds.RecordList.MenuTrigger));
      fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));

      expect(getByText("Confirm Delete")).toBeTruthy();
      fireEvent.press(getByTestId(TestIds.Modal.NoButton));
    });

    test("edit record", () => {
      setIsConnected(false);

      const { getByTestId, getByText } = customRender();

      expect(getByText(Labels.TimelineScreen.PendingRecords)).toBeTruthy();

      fireEvent.press(getByTestId(TestIds.RecordList.MenuTrigger));
      fireEvent.press(getByTestId(TestIds.RecordList.EditRecordAction));

      expect(mockedNavigate).toBeCalledWith("Record", {
        record: JSON.stringify(algaeRecords.getPending()[0].record),
      });
    });
  });
});
