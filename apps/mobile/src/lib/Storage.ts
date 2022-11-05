import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "./Logger";
import { jsonToRecord } from "../record/Record";
import { Errors } from "../constants/Strings";

const StorageKeys = {
  photos: "photos",
  appConfig: "appConfig",
  cachedRecords: "cachedRecords",
  pendingRecords: "pendingRecords",
} as const;

// TODO: don't hide errors and make the app handle them

// AppConfig Storage APIs
async function loadAppConfig(): Promise<AppSettings | null> {
  return AsyncStorage.getItem(StorageKeys.appConfig)
    .then((value) => (value ? JSON.parse(value) : null))
    .catch((error) => {
      Logger.Error(`loadAppConfig: ${error}`);
      return null;
    });
}

async function saveAppConfig(appSettings: AppSettings): Promise<void> {
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

// Pending Records Storage APIs
async function loadPendingRecords(): Promise<AlgaeRecord[]> {
  return AsyncStorage.getItem(StorageKeys.pendingRecords)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadPendingRecords: ${error}`);
      return [];
    });
}

async function savePendingRecords(
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

async function clearPendingRecords(): Promise<void> {
  return AsyncStorage.removeItem(StorageKeys.pendingRecords).catch((error) => {
    Logger.Error(`clearPendingRecords: ${error}`);
    return error;
  });
}

async function savePendingRecord(record: AlgaeRecord): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!record) {
    return records;
  }

  records.push(record);
  return savePendingRecords(records);
}

async function updatePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const pendingRecords = await loadPendingRecords();
  const pendingRecordIndex = pendingRecords.findIndex(
    (current) => current.id === record.id
  );

  if (pendingRecordIndex === -1) {
    return Promise.reject(Errors.recordNotFound);
  }

  pendingRecords[pendingRecordIndex] = { ...record };

  return savePendingRecords(pendingRecords).then((result) => result);
}

// returns the new list of pending records
async function deletePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!record) {
    return records;
  }

  const index = records.findIndex((current) => current.id === record.id);

  if (index !== -1) {
    records.splice(index, 1);
    await savePendingRecords(records);
    return records;
  }

  return records;
}

// Cached Records Storage APIs
async function loadCachedRecords(): Promise<AlgaeRecord[]> {
  return AsyncStorage.getItem(StorageKeys.cachedRecords)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadCachedRecords: ${error}`);
      return [];
    });
}

async function saveCachedRecords(
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

// Pending Photo Storage APIs
async function loadPendingPhotos(): Promise<PendingPhoto[]> {
  return AsyncStorage.getItem(StorageKeys.photos)
    .then((value) => (value ? JSON.parse(value) : []))
    .catch((error) => {
      Logger.Error(`${error}`);
      return [];
    });
}

async function savePendingPhotos(
  photos: PendingPhoto[]
): Promise<PendingPhoto[]> {
  const existing = await loadPendingPhotos();

  if (!photos) {
    return existing;
  }

  return AsyncStorage.setItem(StorageKeys.photos, JSON.stringify(photos))
    .then(() => photos)
    .catch((error) => {
      Logger.Error(`${error}`);
      return error;
    });
}

async function clearPendingPhotos(): Promise<void> {
  return AsyncStorage.removeItem(StorageKeys.photos).catch((error) => {
    Logger.Error(`${error}`);
    return error;
  });
}

async function savePendingPhoto(photo: PendingPhoto): Promise<PendingPhoto[]> {
  const existing = await loadPendingPhotos();

  if (!photo) {
    return existing;
  }

  // check for other pending photos
  const photos = await loadPendingPhotos();
  photos.push(photo);
  return savePendingPhotos(photos);
}

export {
  loadAppConfig,
  saveAppConfig,
  loadPendingRecords,
  savePendingRecords,
  savePendingRecord,
  updatePendingRecord,
  deletePendingRecord,
  clearPendingRecords,
  loadCachedRecords,
  saveCachedRecords,
  loadPendingPhotos,
  savePendingPhotos,
  clearPendingPhotos,
  savePendingPhoto,
};
