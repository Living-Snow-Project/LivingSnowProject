import React from "react";
import {
  usePendingRecordList,
  useDownloadedRecordList,
} from "../components/screens";

export const useRecordList = (): React.JSX.Element[] => {
  const pendingRecords = usePendingRecordList();
  const downloadedRecords = useDownloadedRecordList();

  let result: React.JSX.Element[] = [];

  if (pendingRecords) {
    result = pendingRecords;
  }

  if (downloadedRecords) {
    result = [...result, ...downloadedRecords];
  }

  return result;
};
