import React, { useCallback } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { AlgaeRecordPropType } from "../record/RecordPropTypes";
import styles from "../styles/Timeline";
import TimelineRow from "./TimelineRow";

type RecordListProps = {
  records: AlgaeRecord[];
  header: string;
  omitRecord?: (record: AlgaeRecord) => boolean;
};

export default function RecordList({
  records,
  header,
  omitRecord,
}: RecordListProps) {
  const RenderRecords = useCallback(
    () => (
      <>
        {records.map((record) => {
          // @ts-ignore (TS complains it is possibly undefined however propTypes.defaultProps assigns it a value)
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
  omitRecord: PropTypes.func,
};

RecordList.defaultProps = {
  omitRecord: () => false,
};
