import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { Alert, Platform } from "react-native";
import Logger from "@livingsnow/logger";
import { RecordsApiV3 } from "@livingsnow/network";
import { AlgaeRecordV3 } from "@livingsnow/record";
import { LocalAlgaeRecordV3 } from "../../types";
import { PhotoManager, UploadError } from "./PhotoManager";
import * as Storage from "./Storage";
import { BackgroundTasks, Notifications } from "../constants/Strings";

export { UploadError };

// in iOS background app refresh can be disabled per app by the user
// TODO: cache that the user has seen this message so they don't see it every time if they choose not to allow background refresh
const checkAndPromptForBackgroundFetchPermission = async () => {
  const isBackgroundFetchAllowed = await BackgroundTask.getStatusAsync();

  if (
    isBackgroundFetchAllowed ==
      BackgroundTask.BackgroundTaskStatus.Restricted &&
    Platform.OS == "ios"
  ) {
    Alert.alert(
      Notifications.backgroundTasksNotAllowed.title,
      Notifications.backgroundTasksNotAllowed.message,
    );
  }

  return Promise.resolve(isBackgroundFetchAllowed);
};

// Register a task to be performed in the background.
// Must have been added to the TaskManager globally using the same name.
async function registerBackgroundFetchAsync(taskName: string): Promise<void> {
  const isBackgroundFetchAllowed =
    await checkAndPromptForBackgroundFetchPermission();

  if (!isBackgroundFetchAllowed) {
    return;
  }

  try {
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(taskName);

    if (!isTaskRegistered) {
      Logger.Info(`Registering background task "${taskName}"`);
      BackgroundTask.registerTaskAsync(taskName);
    }
  } catch (error) {
    Logger.Warn(`isTaskRegisteredAsync threw: ${taskName}: ${error}`);
  }
}

// returns the AlgaeRecordV3 server responds with
// rejects with UploadError
async function uploadV3(
  record: AlgaeRecordV3,
  requestId: string,
): Promise<AlgaeRecordV3> {
  let recordResponse: AlgaeRecordV3;

  try {
    recordResponse = await RecordsApiV3.post(record, requestId);
  } catch (error) {
    // post rejects with string
    Logger.Warn(`RecordsApiV3.post failed: ${error}`);

    const pendingRecord: Storage.PendingAlgaeRecordV3 = {
      ...record,
      requestId,
    };

    await Storage.savePendingRecordV3(pendingRecord);

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData);

    throw new UploadError({
      id: record.id,
      title: Notifications.uploadRecordFailed.title,
      message: Notifications.uploadRecordFailed.message,
    });
  }

  try {
    await PhotoManager.uploadSelectedV3(record.id, recordResponse.id);
  } catch (error) {
    // uploadSelectedV3 rejects with UploadError
    if (error instanceof UploadError) {
      Logger.Warn(`PhotoManager.uploadSelectedV3 failed: ${error.errorInfo}`);
    }

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData);

    throw error;
  }

  return recordResponse;
}

async function loadPendingV3(): Promise<LocalAlgaeRecordV3[]> {
  const pendingRecords = await Storage.loadPendingRecordsV3();
  const selectedPhotos = await Storage.loadSelectedPhotos();

  // attach selectedPhotos to record object
  // this is a helper for RecordList component
  const result: LocalAlgaeRecordV3[] = [];

  pendingRecords.forEach((value) =>
    result.push({
      record: value,
      requestId: value.requestId,
      photos: selectedPhotos.get(value.id),
    }),
  );

  return Promise.resolve(result);
}

// uploads any pending v3 data that was saved while user was offline (or failed to upload)
async function retryPendingV3(): Promise<LocalAlgaeRecordV3[]> {
  // Step 1. records
  const records = await Storage.loadPendingRecordsV3();

  await Storage.clearPendingRecordsV3();

  await records.reduce(async (promise, record) => {
    try {
      await promise;
      await uploadV3(record, record.requestId);
      return Promise.resolve();
    } catch (error) {
      // uploadV3 rejects with UploadError
      if (error instanceof UploadError) {
        Logger.Warn(
          `uploadRecordV3 rejected: continue records reducer to prevent data loss: ${error.errorInfo}`,
        );
      }

      return Promise.resolve();
    }
  }, Promise.resolve());

  // Step 2. photos
  await PhotoManager.retryPendingV3();

  // Step 3. return records and photos still on disk
  const result = await loadPendingV3();

  return Promise.resolve(result);
}

async function deletePendingV3(
  recordId: string,
): Promise<LocalAlgaeRecordV3[]> {
  await Storage.deletePendingRecordV3(recordId);

  const result = await loadPendingV3();

  return Promise.resolve(result);
}

// Unregister (cancel) future tasks by specifying the task name
async function unregisterBackgroundFetchAsync(taskName: string): Promise<void> {
  Logger.Info(`Unregistering background task ${taskName}`);
  BackgroundTask.unregisterTaskAsync(taskName);
}

function createRecordManager() {
  return {
    uploadV3,
    deletePendingV3,
    loadPendingV3,
    retryPendingV3,
    unregisterBackgroundFetchAsync,
  };
}

export const RecordManager = createRecordManager();
