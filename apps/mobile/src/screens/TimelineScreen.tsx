import React, { useEffect, useState } from "react";
import { FlatList } from "native-base";
import NetInfo from "@react-native-community/netinfo";
import { StatusBar } from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import { TestIds } from "../constants/TestIds";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";
import { useRecordList } from "../hooks/useRecordList";

export function TimelineScreen() {
  const recordList = useRecordList();
  const [connected, setConnected] = useState<boolean>(false);
  const algaeRecords = useAlgaeRecordsContext();

  const state = algaeRecords.getCurrentState();
  const refreshing = state != "Idle";

  useEffect(() => {
    let prevIsConnected = connected;
    const unsubscribe = NetInfo.addEventListener((netInfo) => {
      const isConnected = !!netInfo.isConnected;

      // there are various configurations the handler can be called for
      // we're only interested in the connection state
      if (prevIsConnected != isConnected) {
        setConnected(isConnected);
        prevIsConnected = isConnected;
        if (isConnected) {
          algaeRecords.fullSync();
        }
      }
    });

    return unsubscribe;
  }, [algaeRecords, connected]);

  const onRefreshHandler = () => {
    if (connected && !refreshing) {
      algaeRecords.fullSync();
    }
  };

  const renderItem = ({ item }) => item;

  // TODO: called repeatedly when "true-end" reached and results in appending duplicate records
  const onEndReached = () => {
    // keep an eye on this (if list is "empty" and it gets called)
    const downloadedRecords = algaeRecords.getDownloadedRecords();
    algaeRecords.downloadNextRecords(
      downloadedRecords[downloadedRecords.length - 1].date
    );
  };

  return (
    <>
      <StatusBar state={state} isConnected={connected} />
      <FlatList
        data={recordList}
        testID={TestIds.TimelineScreen.FlatList}
        renderItem={renderItem}
        ListEmptyComponent={ExampleRecordList}
        onRefresh={onRefreshHandler}
        refreshing={false} // StatusBar component handles activity
        onEndReachedThreshold={5}
        onEndReached={onEndReached}
      />
    </>
  );
}
