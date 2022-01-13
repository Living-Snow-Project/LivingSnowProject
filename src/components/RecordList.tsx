import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Record } from "../record/Record";
import styles from "../styles/Timeline";
import TimelineRow from "./TimelineRow";

type RecordListProps = {
  records: Record[];
  header: string;
  omitRecord?: (record: Record) => boolean;
};

export default function RecordList({
  records,
  header,
  omitRecord = () => false,
}: RecordListProps) {
  const navigation = useNavigation();

  const RenderRecords = useCallback(
    () => (
      <>
        {records.map((record) => {
          if (omitRecord(record)) {
            return null;
          }
          return (
            <TimelineRow
              key={record.id}
              navigation={navigation}
              record={record}
            />
          );
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

RecordList.defaultProps = {
  omitRecord: () => false,
};
