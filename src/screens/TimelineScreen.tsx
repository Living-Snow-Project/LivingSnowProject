import React, { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import styles from "../styles/Timeline";
import TestIds from "../constants/TestIds";
import {
  RecordReducerActionsContext,
  RecordReducerStateContext,
} from "../hooks/useRecordReducer";
import useRecordList from "../hooks/useRecordList";

const separator = <View style={styles.separator} />;

export default function TimelineScreen({ navigation }) {
  const recordList = useRecordList(navigation);
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const recordReducerActionsContext = useContext(RecordReducerActionsContext);
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  // TODO: should be in App component and in a Reducer\Context
  useEffect(
    () =>
      NetInfo.addEventListener(({ isConnected }) => {
        setConnected(!!isConnected);

        if (isConnected) {
          setRefreshing(true);
        }
      }),
    []
  );

  useEffect(() => {
    if (!refreshing) {
      return;
    }

    if (!connected) {
      setRefreshing(false);
      return;
    }

    recordReducerActionsContext
      .retryPendingRecords()
      .then(() => recordReducerActionsContext.downloadRecords())
      .catch(() =>
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <StatusBar
        state={recordReducerStateContext.state}
        isConnected={connected}
      />
      <FlatList
        data={recordList}
        renderItem={({ item }) => item}
        ListEmptyComponent={ExampleRecordList}
        ItemSeparatorComponent={() => separator}
        onEndReached={() => {
          // keep an eye on this (if list is "empty" and it gets called)
          const { downloadedRecords } = recordReducerStateContext;
          recordReducerActionsContext.downloadNextRecords(
            downloadedRecords[downloadedRecords.length - 1].date
          );
        }}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, index) => `${index}`}
        refreshing={false}
        onRefresh={() => setRefreshing(true)}
        testID={TestIds.TimelineScreen.FlatList}
      />
    </View>
  );
}
