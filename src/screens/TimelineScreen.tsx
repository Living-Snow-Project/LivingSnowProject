import React, { useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import styles from "../styles/Timeline";
import {
  DownloadedRecordList,
  ExampleRecordList,
  PendingRecordList,
} from "../components/RecordList";
import TestIds from "../constants/TestIds";
import { RecordReducerActionsContext } from "../hooks/useRecordReducer";

export default function TimelineScreen({ navigation }) {
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const recordReducerActionsContext = useContext(RecordReducerActionsContext);

  // TODO: this should be Context done during application startup
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
      <StatusBar isConnected={connected} />
      <ScrollView
        style={styles.container}
        testID={TestIds.TimelineScreen.RefreshControl}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <ExampleRecordList />
        <PendingRecordList navigation={navigation} />
        <DownloadedRecordList navigation={navigation} />
      </ScrollView>
    </View>
  );
}
