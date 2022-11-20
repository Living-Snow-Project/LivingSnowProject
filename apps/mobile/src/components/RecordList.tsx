import React, { useCallback, useContext, useRef } from "react";
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AlgaeRecord } from "@livingsnow/record";
import { TimelineScreenNavigationProp } from "../navigation/Routes";
import styles from "../styles/Timeline";
import TimelineRow from "./TimelineRow";
import PressableOpacity from "./PressableOpacity";
import { EditIcon, DeleteIcon } from "./Icons";
import TestIds from "../constants/TestIds";
import { Labels } from "../constants/Strings";
import {
  RecordReducerStateContext,
  RecordReducerActionsContext,
} from "../hooks/useRecordReducer";
import { productionExampleRecord } from "../record/Record";

const actionStyles = StyleSheet.create({
  style: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
});

const recordListInfoRow = (info: string): JSX.Element => (
  <View style={styles.recordStatusContainer}>
    <Text style={styles.recordStatusText}>{info}</Text>
  </View>
);

type RecordListProps = {
  header: string;
  renderRecords: JSX.Element[];
};

function recordList({ header, renderRecords }: RecordListProps): JSX.Element[] {
  return [recordListInfoRow(header), ...renderRecords];
}

function ExampleRecordList() {
  const records = recordList({
    header: Labels.TimelineScreen.ExampleRecords,
    renderRecords: [
      <TimelineRow key="single_example" record={productionExampleRecord()} />,
    ],
  });

  return (
    <>
      {records[0]}
      {records[1]}
    </>
  );
}

function useDownloadedRecordList() {
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  const renderRecords = useCallback(() => {
    const records: AlgaeRecord[] = recordReducerStateContext.downloadedRecords;
    const result: Array<JSX.Element> = [];
    let previousDate: Date | undefined;

    for (let i = 0; i < records.length; ++i) {
      const current = records[i];
      if (
        previousDate === undefined ||
        previousDate.getFullYear() > current.date.getFullYear()
      ) {
        result.push(recordListInfoRow(current.date.getFullYear().toString()));
      }

      previousDate = current.date;

      result.push(<TimelineRow key={current.id} record={current} />);
    }

    return result;
  }, [recordReducerStateContext]);

  if (recordReducerStateContext.downloadedRecords.length === 0) {
    return null;
  }

  return recordList({
    header: Labels.TimelineScreen.DownloadedRecords,
    renderRecords: renderRecords(),
  });
}

function usePendingRecordList(navigation: TimelineScreenNavigationProp) {
  const swipeable = useRef<Swipeable | null>();
  const recordReducerStateContext = useContext(RecordReducerStateContext);
  const recordReducerActionsContext = useContext(RecordReducerActionsContext);

  const renderAction = (
    record: AlgaeRecord,
    testId: string,
    color: string,
    icon: JSX.Element,
    onPress: (record: AlgaeRecord) => void
  ) => (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: 0 }],
      }}
    >
      <PressableOpacity
        testID={testId}
        style={[
          actionStyles.style,
          {
            backgroundColor: color,
          },
        ]}
        onPress={() => onPress(record)}
      >
        {icon}
      </PressableOpacity>
    </Animated.View>
  );

  const closeAnimatedView = () => swipeable?.current?.close();

  const onDelete = (record: AlgaeRecord) => {
    Alert.alert("Delete record", "Are you sure?", [
      {
        text: "Yes",
        onPress: async () => {
          await recordReducerActionsContext.delete(record);
          closeAnimatedView();
        },
      },
      {
        text: "No",
        style: "cancel",
        onPress: closeAnimatedView,
      },
    ]);
  };

  const onEdit = (record: AlgaeRecord) => {
    navigation.navigate("Record", { record });
    closeAnimatedView();
  };

  const renderRightActions = (record: AlgaeRecord) => (
    <View
      style={{
        width: 128,
        flexDirection: "row",
      }}
    >
      {renderAction(
        record,
        TestIds.RecordList.DeleteRecordAction,
        "gainsboro",
        DeleteIcon(),
        onDelete
      )}
      {renderAction(
        record,
        TestIds.RecordList.EditRecordAction,
        "gainsboro",
        EditIcon(),
        onEdit
      )}
    </View>
  );

  const renderRecords = useCallback(
    () =>
      recordReducerStateContext.pendingRecords.map((record) => (
        <Swipeable
          ref={(ref) => {
            swipeable.current = ref;
          }}
          key={record.id}
          rightThreshold={40}
          renderRightActions={() => renderRightActions(record)}
        >
          <TimelineRow record={record} />
        </Swipeable>
      )),
    [recordReducerStateContext.pendingRecords]
  );

  if (recordReducerStateContext.pendingRecords.length === 0) {
    return null;
  }

  return recordList({
    header: Labels.TimelineScreen.PendingRecords,
    renderRecords: renderRecords(),
  });
}

export { ExampleRecordList, useDownloadedRecordList, usePendingRecordList };
