import React, { useCallback, useContext, useRef } from "react";
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AlgaeRecordPropType } from "../record/PropTypes";
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

const actionStyles = StyleSheet.create({
  style: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
});

type RecordListProps = {
  records: AlgaeRecord[];
  header: string;
  omitRecord: (record: AlgaeRecord) => boolean;
};

function RecordList({ records, header, omitRecord }: RecordListProps) {
  const RenderRecords = useCallback(
    () => (
      <>
        {records.map((record) => {
          if (omitRecord(record)) {
            return null;
          }
          return <TimelineRow key={record.id} record={record} />;
        })}
      </>
    ),
    [records, omitRecord]
  );

  if (records.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.recordStatusContainer}>
        <Text style={styles.recordStatusText}>{header}</Text>
      </View>
      <RenderRecords />
    </>
  );
}

RecordList.propTypes = {
  records: PropTypes.arrayOf(AlgaeRecordPropType).isRequired,
  header: PropTypes.string.isRequired,
  omitRecord: PropTypes.func.isRequired,
};

function PendingRecordList() {
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
    Alert.alert("Edit", JSON.stringify(record));
    // TODO: navigate to RecordScreen in edit mode...
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
        "lightgrey",
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

  const RenderRecords = useCallback(
    () => (
      <>
        {recordReducerStateContext.pendingRecords.map((record) => (
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
        ))}
      </>
    ),
    [recordReducerStateContext.pendingRecords]
  );

  if (recordReducerStateContext.pendingRecords.length === 0) {
    return null;
  }

  return (
    <>
      <View style={styles.recordStatusContainer}>
        <Text style={styles.recordStatusText}>
          {Labels.TimelineScreen.PendingRecords}
        </Text>
      </View>
      <RenderRecords />
    </>
  );
}

export { RecordList, PendingRecordList };
