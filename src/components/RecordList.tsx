import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
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
import { isAtlas, productionExampleRecord } from "../record/Record";
import { getAppSettings } from "../../AppSettings";

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
    renderRecords: [<TimelineRow record={productionExampleRecord()} />],
  });

  return (
    <>
      {records[0]}
      {records[1]}
    </>
  );
}

function useDownloadedRecordList(navigation) {
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  const [showAtlasRecords, setShowAtlasRecords] = useState<boolean>(
    getAppSettings().showAtlasRecords
  );
  const [showOnlyAtlasRecords, setShowOnlyAtlasRecords] = useState<boolean>(
    getAppSettings().showOnlyAtlasRecords
  );

  // maybe re-render when user comes back to TimelineScreen
  useEffect(() =>
    navigation.addListener("focus", () => {
      setShowAtlasRecords(getAppSettings().showAtlasRecords);
      setShowOnlyAtlasRecords(getAppSettings().showOnlyAtlasRecords);
    })
  );

  const omitRecord = useCallback(
    (record: AlgaeRecord) => {
      const atlas = isAtlas(record.type);
      return (atlas && !showAtlasRecords) || (!atlas && showOnlyAtlasRecords);
    },
    [showAtlasRecords, showOnlyAtlasRecords]
  );

  const renderRecords = useCallback(() => {
    const filtered = recordReducerStateContext.downloadedRecords.filter(
      (record) => !omitRecord(record)
    );

    const result: Array<JSX.Element> = [];
    let previousDate: Date | undefined;

    for (let i = 0; i < filtered.length; ++i) {
      const current = filtered[i];
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
  }, [recordReducerStateContext, omitRecord]);

  if (recordReducerStateContext.downloadedRecords.length === 0) {
    return null;
  }

  return recordList({
    header: Labels.TimelineScreen.DownloadedRecords,
    renderRecords: renderRecords(),
  });
}

function usePendingRecordList(navigation) {
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
