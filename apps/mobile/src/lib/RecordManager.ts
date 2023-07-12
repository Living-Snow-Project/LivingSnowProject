import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { Alert, Platform } from "react-native";
import Logger from "@livingsnow/logger";
import { RecordsApiV2 } from "@livingsnow/network";
import { AlgaeRecord } from "@livingsnow/record";
import { SelectedPhoto } from "../../types";
import {
  addSelectedPhotos,
  retryAllPendingPhotos,
  uploadSelectedPhotos,
} from "./PhotoManager";
import {
  loadPendingRecords,
  savePendingRecord,
  clearPendingRecords,
} from "./Storage";
import { Notifications } from "../constants/Strings";

type UploadError = {
  title: string;
  message: string;
  // pendingPhotos: PendingPhoto[];
  // pendingRecords: AlgaeRecord[];
};

// returns the AlgaeRecord server responds with
// rejects with UploadError
export async function uploadRecord(
  record: AlgaeRecord,
  selectedPhotos: SelectedPhoto[] = []
): Promise<AlgaeRecord> {
  let recordResponse: AlgaeRecord;

  try {
    await addSelectedPhotos(record.id, selectedPhotos);
  } catch (error) {
    Logger.Warn(
      `saving selected photos failed, continue and try to save record: ${error}`
    );
  }

  try {
    recordResponse = await RecordsApiV2.post(record);
  } catch (error) {
    // post rejects with string
    Logger.Warn(`RecordsApiV2.post failed: ${error}`);

    await savePendingRecord(record);

    const uploadError: UploadError = {
      title: Notifications.uploadRecordFailed.title,
      message: Notifications.uploadRecordFailed.message,
      // pendingRecords,
      // pendingPhotos,
    };

    return Promise.reject(uploadError);
  }

  try {
    await uploadSelectedPhotos(record.id, recordResponse.id);
  } catch (error) {
    Logger.Warn(`PhotoManager.uploadSelectedPhotos failed: ${error}`);

    const uploadError: UploadError = {
      title: Notifications.uploadPhotosFailed.title,
      message: Notifications.uploadPhotosFailed.message,
      // pendingPhotos,
      // pendingRecords,
    };

    // propagate photo uploadError to uploadRecord.catch handler
    return Promise.reject(uploadError);
  }

  return recordResponse;
}

// uploads any pending data that was saved while user was offline (or failed to upload)
export async function retryPendingData(): Promise<void> {
  const records = await loadPendingRecords();

  if (records.length == 0) {
    return;
  }

  await clearPendingRecords();

  await records.reduce(
    async (promise, record) => {
      try {
        await promise;
        return await uploadRecord(record);
      } catch (error) {
        Logger.Warn(
          `uploadRecord rejected: continue records reducer to prevent data loss: ${error}`
        );

        return Promise.resolve();
      }
    },

    Promise.resolve()
  );

  await retryAllPendingPhotos();

  // .then(() => loadPendingRecords());
}

// in iOS background app refresh can be disabled per app by the user
// TODO: cache that the user has seen this message so they don't see it every time if they choose not to allow background refresh
const checkAndPromptForBackgroundFetchPermission = async () => {
  const isBackgroundFetchAllowed: BackgroundFetch.BackgroundFetchStatus | null =
    await BackgroundFetch.getStatusAsync();
  if (
    isBackgroundFetchAllowed === BackgroundFetch.BackgroundFetchStatus.Denied &&
    Platform.OS === "ios"
  ) {
    Alert.alert(
      Notifications.backgroundTasksNotAllowed.title,
      Notifications.backgroundTasksNotAllowed.message
    );
  }
};

// Register a task to be performed in the background.
// Must have been added to the TaskManager globally using the same name.
export async function registerBackgroundFetchAsync(
  taskName: string,
  config: BackgroundFetch.BackgroundFetchOptions | undefined
): Promise<void> {
  await checkAndPromptForBackgroundFetchPermission();

  const isTaskRegistered: boolean = await TaskManager.isTaskRegisteredAsync(
    taskName
  );
  if (!isTaskRegistered) {
    Logger.Info(`Registering background task "${taskName}"`);
    BackgroundFetch.registerTaskAsync(taskName, config);
  }
}

// Unregister (cancel) future tasks by specifying the task name
export async function unregisterBackgroundFetchAsync(
  taskName: string
): Promise<void> {
  Logger.Info(`Unregistering background task ${taskName}`);
  BackgroundFetch.unregisterTaskAsync(taskName);
}
