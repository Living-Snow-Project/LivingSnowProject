import React, { useEffect, useState } from "react";
import { FlatList } from "native-base";
import NetInfo from "@react-native-community/netinfo";
import Logger from "@livingsnow/logger";
import { TimelineScreenNavigationProp } from "../navigation/Routes";
import StatusBar from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import TestIds from "../constants/TestIds";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";
import useRecordList from "../hooks/useRecordList";

type TimelineScreenProps = {
  navigation: TimelineScreenNavigationProp;
};

export default function TimelineScreen({ navigation }: TimelineScreenProps) {
  const recordList = useRecordList(navigation);
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const algaeRecordsContext = useAlgaeRecordsContext();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      setConnected(!!isConnected);

      if (isConnected) {
        setRefreshing(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!refreshing || !connected) {
      return;
    }

    algaeRecordsContext
      .fullSync()
      .catch(() =>
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => setRefreshing(false));
  }, [refreshing, connected]);

  const renderItem = ({ item }) => item;

  const onRefreshHandler = () => {
    if (connected) {
      setRefreshing(true);
    }
  };

  // TODO: called repeatedly when "true-end" reached and results in appending duplicate records
  const onEndReached = () => {
    // keep an eye on this (if list is "empty" and it gets called)
    const downloadedRecords = algaeRecordsContext.getDownloadedRecords();
    algaeRecordsContext.downloadNextRecords(
      downloadedRecords[downloadedRecords.length - 1].date
    );
  };

  return (
    <>
      <StatusBar
        state={algaeRecordsContext.getCurrentState()}
        isConnected={connected}
      />
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
