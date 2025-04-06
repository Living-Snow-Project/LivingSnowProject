import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "@livingsnow/logger";
import { AlgaeRecord, AlgaeRecordV3, jsonToRecord } from "@livingsnow/record";
import { DataResponseV2, DataResponseV3 } from "@livingsnow/network";
import {
  AppSettings,
  PendingPhotos,
  PendingPhotosV3,
  SelectedPhotos,
} from "../../types";
import { Errors } from "../constants/Strings";

const StorageKeys = {
  appConfig: "appConfig",
  cachedRecords: "cachedRecords", // downloaded from cloud
  cachedRecordsV3: "cachedRecordsV3", // downloaded from cloud (new questions plus requestId)
  pendingRecords: "pendingRecords", // not yet uploaded to cloud
  pendingRecordsV3: "pendingRecordsV3", // not yet uploaded to cloud (new questions plus requestId)
  pendingPhotos: "pendingPhotos", // record uploaded, photos not yet uploaded
  pendingPhotosV3: "pendingPhotosV3", // record uploaded, photos not yet uploaded (new questions plus requestId)
  selectedPhotos: "selectedPhotos", // record and photos not yet uploaded
} as const;

// TODO: not sure if this should be type'd here but don't have time and brain space to think about it right now
export type PendingAlgaeRecordV3 = AlgaeRecordV3 & {
  requestId: string; // used to track the upload request
};

// TODO: don't hide errors and make the app handle them

// AppConfig
export async function loadAppConfig(): Promise<AppSettings | null> {
  return AsyncStorage.getItem(StorageKeys.appConfig)
    .then((value) => (value ? JSON.parse(value) : null))
    .catch((error) => {
      Logger.Error(`loadAppConfig: ${error}`);
      return null;
    });
}

export async function saveAppConfig(appSettings: AppSettings): Promise<void> {
  if (!appSettings) {
    return Promise.resolve();
  }

  return AsyncStorage.setItem(
    StorageKeys.appConfig,
    JSON.stringify(appSettings)
  ).catch((error) => {
    Logger.Error(`saveAppConfig: ${error}`);
    return error;
  });
}

// Pending Records (not yet uploaded to cloud)
export async function loadPendingRecords(): Promise<AlgaeRecord[]> {
  return AsyncStorage.getItem(StorageKeys.pendingRecords)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadPendingRecords: ${error}`);
      return [];
    });
}

export async function loadPendingRecordsV3(): Promise<PendingAlgaeRecordV3[]> {
  return AsyncStorage.getItem(StorageKeys.pendingRecordsV3)
    .then((value) => (value ? jsonToRecord<PendingAlgaeRecordV3[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadPendingRecordsV3: ${error}`);
      return [];
    });
}

export async function savePendingRecords(
  records: AlgaeRecord[]
): Promise<AlgaeRecord[]> {
  const existing = await loadPendingRecords();

  if (!records) {
    return existing;
  }

  return AsyncStorage.setItem(
    StorageKeys.pendingRecords,
    JSON.stringify(records)
  )
    .then(() => records)
    .catch((error) => {
      Logger.Error(`savePendingRecords: ${error}`);
      return error;
    });
}

export async function savePendingRecordsV3(
  records: PendingAlgaeRecordV3[]
): Promise<PendingAlgaeRecordV3[]> {
  const existing = await loadPendingRecordsV3();

  if (!records) {
    return existing;
  }

  return AsyncStorage.setItem(
    StorageKeys.pendingRecordsV3,
    JSON.stringify(records)
  )
    .then(() => records)
    .catch((error) => {
      Logger.Error(`savePendingRecordsV3: ${error}`);
      return error;
    });
}

export async function clearPendingRecords(): Promise<void> {
  return AsyncStorage.removeItem(StorageKeys.pendingRecords).catch((error) => {
    Logger.Error(`clearPendingRecords: ${error}`);
    return error;
  });
}

export async function clearPendingRecordsV3(): Promise<void> {
  return AsyncStorage.removeItem(StorageKeys.pendingRecordsV3).catch(
    (error) => {
      Logger.Error(`clearPendingRecordsV3: ${error}`);
      return error;
    }
  );
}

export async function savePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!record) {
    return records;
  }

  records.push(record);
  return savePendingRecords(records);
}

export async function savePendingRecordV3(
  record: PendingAlgaeRecordV3
): Promise<PendingAlgaeRecordV3[]> {
  const records = await loadPendingRecordsV3();

  if (!record) {
    return records;
  }

  records.push(record);
  return savePendingRecordsV3(records);
}

export async function updatePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const pendingRecords = await loadPendingRecords();
  const pendingRecordIndex = pendingRecords.findIndex(
    (current) => current.id === record.id
  );

  if (pendingRecordIndex == -1) {
    return Promise.reject(Errors.recordNotFound);
  }

  pendingRecords[pendingRecordIndex] = { ...record };

  return savePendingRecords(pendingRecords).then((result) => result);
}

export async function updatePendingRecordV3(
  record: PendingAlgaeRecordV3
): Promise<PendingAlgaeRecordV3[]> {
  const pendingRecords = await loadPendingRecordsV3();
  const pendingRecordIndex = pendingRecords.findIndex(
    (current) => current.id === record.id
  );

  if (pendingRecordIndex == -1) {
    return Promise.reject(Errors.recordNotFound);
  }

  pendingRecords[pendingRecordIndex] = { ...record };

  return savePendingRecordsV3(pendingRecords).then((result) => result);
}

// returns the new list of pending records
export async function deletePendingRecord(
  recordId: string
): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!recordId) {
    return records;
  }

  const index = records.findIndex((current) => current.id == recordId);

  if (index != -1) {
    records.splice(index, 1);
    await savePendingRecords(records);
    return records;
  }

  return records;
}

export async function deletePendingRecordV3(
  recordId: string
): Promise<PendingAlgaeRecordV3[]> {
  const records = await loadPendingRecordsV3();

  if (!recordId) {
    return records;
  }

  const index = records.findIndex((current) => current.id == recordId);

  if (index != -1) {
    records.splice(index, 1);
    await savePendingRecordsV3(records);
    return records;
  }

  return records;
}

// Cached Records (downloaded from cloud)
export async function loadCachedRecords(): Promise<DataResponseV2[]> {
  return AsyncStorage.getItem(StorageKeys.cachedRecords)
    .then((value) => (value ? jsonToRecord<DataResponseV2[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadCachedRecords: ${error}`);
      return [];
    });
}

export async function loadCachedRecordsV3(): Promise<DataResponseV3[]> {
  return AsyncStorage.getItem(StorageKeys.cachedRecordsV3)
    .then((value) => (value ? jsonToRecord<DataResponseV3[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadCachedRecordsV3: ${error}`);
      return [];
    });
}

export async function saveCachedRecords(
  records: DataResponseV2[]
): Promise<DataResponseV2[]> {
  const existing = await loadCachedRecords();

  if (!records) {
    return existing;
  }

  return AsyncStorage.setItem(
    StorageKeys.cachedRecords,
    JSON.stringify(records)
  )
    .then(() => records)
    .catch((error) => {
      Logger.Error(`saveCachedRecords: ${error}`);
      return error;
    });
}

export async function saveCachedRecordsV3(
  records: DataResponseV3[]
): Promise<DataResponseV3[]> {
  const existing = await loadCachedRecordsV3();

  if (!records) {
    return existing;
  }

  return AsyncStorage.setItem(
    StorageKeys.cachedRecordsV3,
    JSON.stringify(records)
  )
    .then(() => records)
    .catch((error) => {
      Logger.Error(`saveCachedRecordsV3: ${error}`);
      return error;
    });
}

// Photos Templates
async function loadPhotos<K, T>(key: string): Promise<Map<K, T[]>> {
  return AsyncStorage.getItem(key)
    .then((value) =>
      value ? new Map<K, T[]>(JSON.parse(value)) : new Map<K, T[]>()
    )
    .catch((error) => {
      Logger.Error(`loadPhotos: ${error}`);
      return Promise.reject(error);
    });
}

async function savePhotos<K, T>(
  key: string,
  photos: Map<K, T[]>
): Promise<Map<K, T[]>> {
  const existing = await loadPhotos<K, T>(key);

  if (!photos) {
    return existing;
  }

  return AsyncStorage.setItem(key, JSON.stringify([...photos]))
    .then(() => photos)
    .catch((error) => {
      Logger.Error(`savePhotos: ${error}`);
      return Promise.reject(error);
    });
}

async function clearPhotos(key: string): Promise<void> {
  return AsyncStorage.removeItem(key).catch((error) => {
    Logger.Error(`${error}`);
    return Promise.reject(error);
  });
}

// Selected Photos
export async function loadSelectedPhotos(): Promise<SelectedPhotos> {
  return loadPhotos(StorageKeys.selectedPhotos);
}

export async function saveSelectedPhotos(
  photos: SelectedPhotos
): Promise<SelectedPhotos> {
  return savePhotos(StorageKeys.selectedPhotos, photos);
}

export async function clearSelectedPhotos(): Promise<void> {
  return clearPhotos(StorageKeys.selectedPhotos);
}

// Pending Photos
export async function loadPendingPhotos(): Promise<PendingPhotos> {
  return loadPhotos(StorageKeys.pendingPhotos);
}

export async function loadPendingPhotosV3(): Promise<PendingPhotosV3> {
  return loadPhotos(StorageKeys.pendingPhotosV3);
}

export async function savePendingPhotos(
  photos: PendingPhotos
): Promise<PendingPhotos> {
  return savePhotos(StorageKeys.pendingPhotos, photos);
}

export async function savePendingPhotosV3(
  photos: PendingPhotosV3
): Promise<PendingPhotosV3> {
  return savePhotos(StorageKeys.pendingPhotosV3, photos);
}

export async function clearPendingPhotos(): Promise<void> {
  return clearPhotos(StorageKeys.pendingPhotos);
}

export async function clearPendingPhotosV3(): Promise<void> {
  return clearPhotos(StorageKeys.pendingPhotosV3);
}
