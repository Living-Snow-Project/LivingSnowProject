import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "@livingsnow/logger";
import { AlgaeRecord, jsonToRecord } from "@livingsnow/record";
import { AppSettings, PendingPhotos, SelectedPhotos } from "../../types";
import { Errors } from "../constants/Strings";

const StorageKeys = {
  appConfig: "appConfig",
  cachedRecords: "cachedRecords", // downloaded from cloud
  pendingRecords: "pendingRecords", // not yet uploaded to cloud
  pendingPhotos: "pendingPhotos", // record upload, photos not yet uploaded
  selectedPhotos: "selectedPhotos", // record and photos not yet uploaded
} as const;

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

export async function clearPendingRecords(): Promise<void> {
  return AsyncStorage.removeItem(StorageKeys.pendingRecords).catch((error) => {
    Logger.Error(`clearPendingRecords: ${error}`);
    return error;
  });
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

// returns the new list of pending records
export async function deletePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!record) {
    return records;
  }

  const index = records.findIndex((current) => current.id === record.id);

  if (index != -1) {
    records.splice(index, 1);
    await savePendingRecords(records);
    return records;
  }

  return records;
}

// Cached Records (downloaded from cloud)
export async function loadCachedRecords(): Promise<AlgaeRecord[]> {
  return AsyncStorage.getItem(StorageKeys.cachedRecords)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadCachedRecords: ${error}`);
      return [];
    });
}

export async function saveCachedRecords(
  records: AlgaeRecord[]
): Promise<AlgaeRecord[]> {
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

// TODO: is this needed?
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

// TODO: is this needed?
export async function clearSelectedPhotos(): Promise<void> {
  return clearPhotos(StorageKeys.selectedPhotos);
}

// Pending Photos
export async function loadPendingPhotos(): Promise<PendingPhotos> {
  return loadPhotos(StorageKeys.pendingPhotos);
}

export async function savePendingPhotos(
  photos: PendingPhotos
): Promise<PendingPhotos> {
  return savePhotos(StorageKeys.pendingPhotos, photos);
}

// TODO: delete? probably don't need support for a single photo anymore
/* async function savePendingPhoto(
  photo: PendingPhoto
): Promise<SavedPendingPhoto> {
  const existing = await loadPendingPhotos();

  if (!photo) {
    return existing;
  }

  // check for other pending photos
  const photos = await loadPendingPhotos();
  photos.push(photo);
  return savePendingPhotos(photos);
} */
