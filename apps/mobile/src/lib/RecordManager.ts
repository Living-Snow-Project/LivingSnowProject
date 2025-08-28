import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { Alert, Platform } from "react-native";
import Logger from "@livingsnow/logger";
import { RecordsApiV2, RecordsApiV3 } from "@livingsnow/network";
import { AlgaeRecord, AlgaeRecordV3 } from "@livingsnow/record";
import { LocalAlgaeRecord, LocalAlgaeRecordV3 } from "../../types";
import { PhotoManager, UploadError } from "./PhotoManager";
import * as Storage from "./Storage";
import { BackgroundTasks, Notifications } from "../constants/Strings";

export { UploadError };

// in iOS background app refresh can be disabled per app by the user
// TODO: cache that the user has seen this message so they don't see it every time if they choose not to allow background refresh
const checkAndPromptForBackgroundFetchPermission = async () => {
  const isBackgroundFetchAllowed = await BackgroundFetch.getStatusAsync();

  if (
    isBackgroundFetchAllowed == BackgroundFetch.BackgroundFetchStatus.Denied &&
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
async function registerBackgroundFetchAsync(
  taskName: string,
  config: BackgroundFetch.BackgroundFetchOptions | undefined,
): Promise<void> {
  const isBackgroundFetchAllowed =
    await checkAndPromptForBackgroundFetchPermission();

  if (!isBackgroundFetchAllowed) {
    return;
  }

  try {
    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(taskName);

    if (!isTaskRegistered) {
      Logger.Info(`Registering background task "${taskName}"`);
      BackgroundFetch.registerTaskAsync(taskName, config);
    }
  } catch (error) {
    Logger.Warn(`isTaskRegisteredAsync threw: ${taskName}: ${error}`);
  }
}

// returns the AlgaeRecord server responds with
// rejects with UploadError
async function upload(record: AlgaeRecord): Promise<AlgaeRecord> {
  let recordResponse: AlgaeRecord;

  try {
    recordResponse = await RecordsApiV2.post(record);
  } catch (error) {
    // post rejects with string
    Logger.Warn(`RecordsApiV2.post failed: ${error}`);

    await Storage.savePendingRecord(record);

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData, {
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });

    throw new UploadError({
      id: record.id,
      title: Notifications.uploadRecordFailed.title,
      message: Notifications.uploadRecordFailed.message,
    });
  }

  try {
    await PhotoManager.uploadSelected(record.id, recordResponse.id);
  } catch (error) {
    // uploadSelected rejects with UploadError
    Logger.Warn(`PhotoManager.uploadSelected failed: ${error.errorInfo}`);

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData, {
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });

    throw error;
  }

  return recordResponse;
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

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData, {
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });

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
    Logger.Warn(`PhotoManager.uploadSelectedV3 failed: ${error.errorInfo}`);

    await registerBackgroundFetchAsync(BackgroundTasks.UploadData, {
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });

    throw error;
  }

  return recordResponse;
}

async function loadPending(): Promise<LocalAlgaeRecord[]> {
  const pendingRecords = await Storage.loadPendingRecords();
  const selectedPhotos = await Storage.loadSelectedPhotos();

  // this is a curteousy for RecordList component
  const result: LocalAlgaeRecord[] = [];

  pendingRecords.forEach((value) =>
    result.push({ record: value, photos: selectedPhotos.get(value.id) }),
  );

  return Promise.resolve(result);
}

async function loadPendingV3(): Promise<LocalAlgaeRecordV3[]> {
  const pendingRecords = await Storage.loadPendingRecordsV3();
  const selectedPhotos = await Storage.loadSelectedPhotos();

  // attach selectedPhotos to record object
  // this is a curteousy for RecordList component
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

// uploads any pending data that was saved while user was offline (or failed to upload)
async function retryPending(): Promise<LocalAlgaeRecord[]> {
  // Step 1. records
  const records = await Storage.loadPendingRecords();

  await Storage.clearPendingRecords();

  await records.reduce(
    async (promise, record) => {
      try {
        await promise;
        return await upload(record);
      } catch (error) {
        // upload rejects with UploadError
        Logger.Warn(
          `uploadRecord rejected: continue records reducer to prevent data loss: ${error.errorInfo}`,
        );

        return Promise.resolve();
      }
    },

    Promise.resolve(),
  );

  // Step 2. photos
  await PhotoManager.retryPending();

  // Step 3. return records and photos still on disk
  const result = await loadPending();

  return Promise.resolve(result);
}

// uploads any pending v33 data that was saved while user was offline (or failed to upload)
async function retryPendingV3(): Promise<LocalAlgaeRecordV3[]> {
  // Step 1. records
  const records = await Storage.loadPendingRecordsV3();

  await Storage.clearPendingRecordsV3();

  await records.reduce(
    async (promise, record) => {
      try {
        await promise;
        return await uploadV3(record, record.requestId);
      } catch (error) {
        // uploadV3 rejects with UploadError
        Logger.Warn(
          `uploadRecordV3 rejected: continue records reducer to prevent data loss: ${error.errorInfo}`,
        );

        return Promise.resolve();
      }
    },

    Promise.resolve(),
  );

  // Step 2. photos
  await PhotoManager.retryPendingV3();

  // Step 3. return records and photos still on disk
  const result = await loadPendingV3();

  return Promise.resolve(result);
}

async function deletePending(recordId: string): Promise<LocalAlgaeRecord[]> {
  await Storage.deletePendingRecord(recordId);

  const result = await loadPending();

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
  BackgroundFetch.unregisterTaskAsync(taskName);
}

function createRecordManager() {
  return {
    upload,
    uploadV3,
    deletePending,
    deletePendingV3,
    loadPending,
    loadPendingV3,
    retryPending,
    retryPendingV3,
    unregisterBackgroundFetchAsync,
  };
}

export const RecordManager = createRecordManager();
