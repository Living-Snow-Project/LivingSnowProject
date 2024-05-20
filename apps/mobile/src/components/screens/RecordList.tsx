import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Icon, Menu, Pressable } from "native-base";
import { TimelineScreenNavigationProp } from "../../navigation/Routes";
import { Modal } from "../feedback";
import { Divider } from "../layout";
import { TimelineRow } from "./TimelineRow";
import { Labels, TestIds } from "../../constants";
import { useAlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { productionExampleRecord } from "../../record/Record";
import { IAlgaeRecords, MinimalAlgaeRecord } from "../../../types/AlgaeRecords";

function ThreeDotsIcon() {
  return <Icon as={Ionicons} name="ellipsis-horizontal-outline" size="lg" />;
}

function ExampleRecordList() {
  const { record, photos } = productionExampleRecord();
  const records = [
    <Divider
      key={Labels.TimelineScreen.ExampleRecords}
      text={Labels.TimelineScreen.ExampleRecords}
    />,
    <TimelineRow key="single_example" record={record} photos={photos} />,
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
  const records = algaeRecords.getDownloaded();
  const pendingLength = algaeRecords.getPending().length;

  const renderRecords = useMemo(() => {
    const result: JSX.Element[] = [];

    // "Downloaded Divider" is only useful if there are pending records
    if (pendingLength > 0) {
      result.push(
        <Divider
          key={Labels.TimelineScreen.DownloadedRecords}
          text={Labels.TimelineScreen.DownloadedRecords}
        />,
      );
    }

    records.forEach((record) =>
      result.push(
        <TimelineRow
          key={record.id}
          record={record}
          photos={record.photos.appPhotos}
        />,
      ),
    );

    return result;
  }, [records, pendingLength]);

  if (records.length == 0) {
    return null;
  }

  return renderRecords;
}

type PendingTimelineRowProps = {
  localRecord: MinimalAlgaeRecord;
  algaeRecords: IAlgaeRecords;
};

function PendingTimelineRow({
  localRecord,
  algaeRecords,
}: PendingTimelineRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<TimelineScreenNavigationProp>();

  const onPressDelete = () => setIsOpen(true);
  const onConfirmDelete = () => algaeRecords.delete(localRecord.record.id);

  const onEdit = () =>
    navigation.navigate("Record", {
      record: JSON.stringify(localRecord.record),
    });

  const menuTrigger = (props: any) => (
    <Pressable {...props} testID={TestIds.RecordList.MenuTrigger}>
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
        <Menu.Item
          onPress={onEdit}
          testID={TestIds.RecordList.EditRecordAction}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onPress={onPressDelete}
          testID={TestIds.RecordList.DeleteRecordAction}
        >
          Delete
        </Menu.Item>
      </Menu>
    </>
  );

  return (
    <TimelineRow
      record={localRecord.record}
      photos={localRecord.photos}
      actionsMenu={actionsMenu}
    />
  );
}

function usePendingRecordList() {
  const algaeRecords = useAlgaeRecordsContext();
  const pendingRecords = algaeRecords.getPending();

  const renderRecords = useMemo(() => {
    const result: JSX.Element[] = [];

    if (pendingRecords.length == 0) {
      return null;
    }

    result.push(
      <Divider
        key={Labels.TimelineScreen.PendingRecords}
        text={Labels.TimelineScreen.PendingRecords}
      />,
    );

    pendingRecords.forEach((record, index) => {
      /* eslint-disable react/no-array-index-key */
      result.push(
        <PendingTimelineRow
          key={`pending-${index}`}
          localRecord={record}
          algaeRecords={algaeRecords}
        />,
      );
    });

    return result;
  }, [algaeRecords, pendingRecords]);

  return renderRecords;
}

export { ExampleRecordList, useDownloadedRecordList, usePendingRecordList };
