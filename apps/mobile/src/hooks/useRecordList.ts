import {
  usePendingRecordList,
  useDownloadedRecordList,
} from "../components/screens";

export const useRecordList = (): JSX.Element[] => {
  const pendingRecords = usePendingRecordList();
  const downloadedRecords = useDownloadedRecordList();

  let result: JSX.Element[] = [];

  if (pendingRecords) {
    result = pendingRecords;
  }

  if (downloadedRecords) {
    result = [...result, ...downloadedRecords];
  }

  return result;
};
