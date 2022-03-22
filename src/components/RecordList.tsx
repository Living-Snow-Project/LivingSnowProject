import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert, Animated, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
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
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
});

type RecordListProps = {
  header: string;
  renderRecords: () => JSX.Element;
};

function RecordList({ header, renderRecords }: RecordListProps) {
  return (
    <>
      <View style={styles.recordStatusContainer}>
        <Text style={styles.recordStatusText}>{header}</Text>
      </View>
      {renderRecords()}
    </>
  );
}

RecordList.propTypes = {
  header: PropTypes.string.isRequired,
  renderRecords: PropTypes.func.isRequired,
};

function ExampleRecordList() {
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  if (
    recordReducerStateContext.pendingRecords.length !== 0 ||
    recordReducerStateContext.downloadedRecords.length !== 0
  ) {
    return null;
  }

  return (
    <RecordList
      header={Labels.TimelineScreen.ExampleRecords}
      renderRecords={() => <TimelineRow record={productionExampleRecord()} />}
    />
  );
}

function DownloadedRecordList({ navigation }) {
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  const [showAtlasRecords, setShowAtlasRecords] = useState<boolean>(
    getAppSettings().showAtlasRecords
  );
  const [showOnlyAtlasRecords, setShowOnlyAtlasRecords] = useState<boolean>(
    getAppSettings().showOnlyAtlasRecords
  );

  // re-render when user comes back from Settings screen
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

  const RenderRecords = useCallback(
    () => (
      <>
        {recordReducerStateContext.downloadedRecords.map((record) => {
          if (omitRecord(record)) {
            return null;
          }
          return <TimelineRow key={record.id} record={record} />;
        })}
      </>
    ),
    [recordReducerStateContext, omitRecord]
  );

  if (recordReducerStateContext.downloadedRecords.length === 0) {
    return null;
  }

  return (
    <RecordList
      header={Labels.TimelineScreen.DownloadedRecords}
      renderRecords={RenderRecords}
    />
  );
}

function PendingRecordList({ navigation }) {
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
    <RecordList
      header={Labels.TimelineScreen.PendingRecords}
      renderRecords={RenderRecords}
    />
  );
}

export { DownloadedRecordList, ExampleRecordList, PendingRecordList };
