import React, { useMemo, useRef } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";
import { Box } from "native-base";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AlgaeRecord } from "@livingsnow/record";
import { TimelineScreenNavigationProp } from "../navigation/Routes";
import Divider from "./Divider";
import TimelineRow from "./TimelineRow";
import PressableOpacity from "./PressableOpacity";
import { EditIcon, DeleteIcon } from "./Icons";
import TestIds from "../constants/TestIds";
import { Labels } from "../constants/Strings";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";
import { productionExampleRecord } from "../record/Record";

const actionStyles = StyleSheet.create({
  style: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
});

function ExampleRecordList() {
  const records = [
    <Divider
      key={Labels.TimelineScreen.ExampleRecords}
      text={Labels.TimelineScreen.ExampleRecords}
    />,
    <TimelineRow key="single_example" record={productionExampleRecord()} />,
  ];

  return (
    <>
      {records[0]}
      {records[1]}
    </>
  );
}

function useDownloadedRecordList() {
  const algaeRecordsContext = useAlgaeRecordsContext();

  const renderRecords = useMemo(() => {
    const records: AlgaeRecord[] = algaeRecordsContext.getDownloadedRecords();
    const result: JSX.Element[] = [];
    let previousDate: Date | undefined;

    // Downloaded Divider is only useful if there are pending records
    if (algaeRecordsContext.getPendingRecords().length > 0) {
      result.push(
        <Box borderBottomWidth={1} borderTopWidth={1}>
          <Divider
            key={Labels.TimelineScreen.DownloadedRecords}
            text={Labels.TimelineScreen.DownloadedRecords}
          />
        </Box>
      );
    }

    for (let i = 0; i < records.length; ++i) {
      const current = records[i];
      if (
        !previousDate ||
        previousDate.getFullYear() > current.date.getFullYear()
      ) {
        // because of StatusBar, first date would have extra thick border width
        if (i == 0) {
          result.push(
            <Box borderBottomWidth={1}>
              <Divider text={current.date.getFullYear().toString()} />
            </Box>
          );
        } else {
          result.push(
            <>
              <Box borderBottomWidth={1} borderTopWidth={1}>
                <Divider text={current.date.getFullYear().toString()} />
              </Box>
              <Divider />
            </>
          );
        }
      }

      previousDate = current.date;

      result.push(<TimelineRow key={current.id} record={current} />);
    }

    return result;
  }, [algaeRecordsContext]);

  if (algaeRecordsContext.getDownloadedRecords().length == 0) {
    return null;
  }

  return renderRecords;
}

function usePendingRecordList(navigation: TimelineScreenNavigationProp) {
  const swipeable = useRef<Swipeable | null>();
  const algaeRecordsContext = useAlgaeRecordsContext();

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
          await algaeRecordsContext.delete(record);
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

  const renderRecords = useMemo(() => {
    const result: JSX.Element[] = [];

    if (algaeRecordsContext.getPendingRecords().length == 0) {
      return null;
    }

    result.push(
      <Box borderBottomWidth={1}>
        <Divider
          key={Labels.TimelineScreen.PendingRecords}
          text={Labels.TimelineScreen.PendingRecords}
        />
      </Box>
    );

    algaeRecordsContext.getPendingRecords().forEach((record) =>
      result.push(
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
      )
    );

    return result;
  }, [algaeRecordsContext.getPendingRecords()]);

  return renderRecords;
}

export { ExampleRecordList, useDownloadedRecordList, usePendingRecordList };
