import { TimelineScreenNavigationProp } from "../navigation/Routes";
import {
  usePendingRecordList,
  useDownloadedRecordList,
} from "../components/RecordList";

const useRecordList = (
  navigation: TimelineScreenNavigationProp
): JSX.Element[] => {
  const pendingRecords = usePendingRecordList(navigation);
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

export default useRecordList;
