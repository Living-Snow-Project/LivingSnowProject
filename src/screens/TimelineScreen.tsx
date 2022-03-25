import React, { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import styles from "../styles/Timeline";
import TestIds from "../constants/TestIds";
import { RecordReducerActionsContext } from "../hooks/useRecordReducer";
import useRecordList from "../hooks/useRecordList";

export default function TimelineScreen({ navigation }) {
  const recordList = useRecordList(navigation);
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const recordReducerActionsContext = useContext(RecordReducerActionsContext);

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
      <StatusBar isConnected={connected} />
      <FlatList
        data={recordList}
        renderItem={({ item }) => item}
        ListEmptyComponent={ExampleRecordList}
        // ItemSeparatorComponent={Separator}
        // onEndReachThreshold={() => setRefreshing(true)}
        keyExtractor={(item, index) => `${index}`}
        refreshing={refreshing}
        onRefresh={() => setRefreshing(true)}
        testID={TestIds.TimelineScreen.RefreshControl}
      />
    </View>
  );
}
