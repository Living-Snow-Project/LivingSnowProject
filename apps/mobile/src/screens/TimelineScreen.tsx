import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Divider } from "native-base";
import Logger from "@livingsnow/logger";
import { TimelineScreenNavigationProp } from "../navigation/Routes";
import StatusBar from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import styles from "../styles/Timeline";
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
      .retryPendingRecords()
      .then(() => algaeRecordsContext.downloadRecords())
      .catch(() =>
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => setRefreshing(false));
  }, [refreshing, connected]);

  const onRefreshHandler = () => {
    if (connected) {
      setRefreshing(true);
    }
  };

  return (
    <View
      style={styles.container}
      testID={TestIds.TimelineScreen.RecordListView}
    >
      <StatusBar
        state={algaeRecordsContext.getCurrentState()}
        isConnected={connected}
      />
      <FlatList
        data={recordList}
        testID={TestIds.TimelineScreen.FlatList}
        renderItem={({ item }) => item}
        keyExtractor={(item, index) => `${index}`}
        ListEmptyComponent={ExampleRecordList}
        ItemSeparatorComponent={Divider}
        onRefresh={onRefreshHandler}
        refreshing={false} // StatusBar component handles activity indicator
        onEndReached={() => {
          // keep an eye on this (if list is "empty" and it gets called)
          const downloadedRecords = algaeRecordsContext.getDownloadedRecords();
          algaeRecordsContext.downloadNextRecords(
            downloadedRecords[downloadedRecords.length - 1].date
          );
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
