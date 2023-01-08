import React, { useEffect, useState } from "react";
import { FlatList } from "native-base";
import NetInfo from "@react-native-community/netinfo";
import { TimelineScreenProps } from "../navigation/Routes";
import { StatusBar } from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import { TestIds } from "../constants/TestIds";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";
import { useRecordList } from "../hooks/useRecordList";

type OnFocusTimelineAction = "Idle" | "Update Pending" | "Update Downloaded";
let onFocusTimelineAction: OnFocusTimelineAction = "Idle";

export function setOnFocusTimelineAction(action: OnFocusTimelineAction) {
  onFocusTimelineAction = action;
}

export function TimelineScreen({ navigation }: TimelineScreenProps) {
  const recordList = useRecordList();
  const [connected, setConnected] = useState<boolean>(false);
  const algaeRecords = useAlgaeRecordsContext();

  const state = algaeRecords.getCurrentState();
  const refreshing = state != "Idle";

  useEffect(
    () =>
      navigation.addListener("focus", () => {
        switch (onFocusTimelineAction) {
          case "Update Pending":
            algaeRecords.retryPendingRecords();
            break;

          case "Update Downloaded":
            algaeRecords.downloadRecords();
            break;

          default:
            break;
        }

        onFocusTimelineAction = "Idle";
      }),
    [navigation, algaeRecords]
  );

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

  const onEndReached = () => {
    algaeRecords.downloadNextRecords();
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
