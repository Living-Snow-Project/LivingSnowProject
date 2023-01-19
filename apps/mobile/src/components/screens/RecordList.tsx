import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Icon, Menu, Pressable } from "native-base";
import { AlgaeRecord } from "@livingsnow/record";
import { TimelineScreenNavigationProp } from "../../navigation/Routes";
import { Modal } from "../feedback";
import { Divider } from "../layout";
import { TimelineRow } from "./TimelineRow";
import { Labels, TestIds } from "../../constants";
import { useAlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { productionExampleRecord } from "../../record/Record";
import { IAlgaeRecords } from "../../../types/AlgaeRecords";

function ThreeDotsIcon() {
  return <Icon as={Ionicons} name="ellipsis-horizontal-outline" size="lg" />;
}

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
  const algaeRecords = useAlgaeRecordsContext();
  const records = algaeRecords.getDownloadedRecords();
  const pendingLength = algaeRecords.getPendingRecords().length;

  const renderRecords = useMemo(() => {
    const result: JSX.Element[] = [];

    // "Downloaded Divider" is only useful if there are pending records
    if (pendingLength > 0) {
      result.push(
        <Divider
          key={Labels.TimelineScreen.DownloadedRecords}
          text={Labels.TimelineScreen.DownloadedRecords}
        />
      );
    }

    records.forEach((record) =>
      result.push(<TimelineRow key={record.id} record={record} />)
    );

    return result;
  }, [records, pendingLength]);

  if (records.length == 0) {
    return null;
  }

  return renderRecords;
}

type PendingTimelineRowProps = {
  record: AlgaeRecord;
  algaeRecords: IAlgaeRecords;
};

function PendingTimelineRow({ record, algaeRecords }: PendingTimelineRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<TimelineScreenNavigationProp>();

  const onPressDelete = () => setIsOpen(true);
  const onConfirmDelete = () => algaeRecords.delete(record);

  const onEdit = () =>
    navigation.navigate("Record", { record: JSON.stringify(record) });

  const menuTrigger = (props: any) => (
    <Pressable {...props}>
      <ThreeDotsIcon />
    </Pressable>
  );

  const actionsMenu = (
    <>
      <Modal
        body="Are you sure you want to delete this pending record?"
        header="Confirm Delete"
        isOpen={isOpen}
        testId={TestIds.Modal.DeletePendingRecord}
        setIsOpen={setIsOpen}
        onConfirm={onConfirmDelete}
      />
      <Menu trigger={menuTrigger}>
        <Menu.Item onPress={onEdit}>Edit</Menu.Item>
        <Menu.Item onPress={onPressDelete}>Delete</Menu.Item>
      </Menu>
    </>
  );

  return <TimelineRow record={record} actionsMenu={actionsMenu} />;
}

function usePendingRecordList() {
  const algaeRecords = useAlgaeRecordsContext();
  const pendingRecords = algaeRecords.getPendingRecords();

  const renderRecords = useMemo(() => {
    const result: JSX.Element[] = [];

    if (pendingRecords.length == 0) {
      return null;
    }

    result.push(
      <Divider
        key={Labels.TimelineScreen.PendingRecords}
        text={Labels.TimelineScreen.PendingRecords}
      />
    );

    pendingRecords.forEach((record, index) => {
      /* eslint-disable react/no-array-index-key */
      result.push(
        <PendingTimelineRow
          key={`pending-${index}`}
          record={record}
          algaeRecords={algaeRecords}
        />
      );
    });

    return result;
  }, [algaeRecords, pendingRecords]);

  return renderRecords;
}

export { ExampleRecordList, useDownloadedRecordList, usePendingRecordList };
