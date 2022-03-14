import AsyncStorage from "@react-native-async-storage/async-storage";
import Logger from "./Logger";
import { jsonToRecord } from "../record/Record";

const StorageKeys = {
  appConfig: "appConfig",
  records: "records", // pending records (not uploaded)
  cachedRecords: "cachedRecords", // previously downloaded
  photos: "photos",
} as const;

// AppConfig Storage APIs
async function loadAppConfig(): Promise<AppSettings | null> {
  return AsyncStorage.getItem(StorageKeys.appConfig)
    .then((value) => (value ? JSON.parse(value) : null))
    .catch((error) => {
      Logger.Error(`loadAppConfig: ${error}`);
      return null;
    });
}

async function saveAppConfig(appSettings: AppSettings): Promise<void | Error> {
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
  return AsyncStorage.getItem(StorageKeys.records)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadPendingRecords: ${error}`);
      return [];
    });
}

async function savePendingRecords(
  records: AlgaeRecord[]
): Promise<void | Error> {
  if (!records) {
    return Promise.resolve();
  }

  return AsyncStorage.setItem(
    StorageKeys.records,
    JSON.stringify(records)
  ).catch((error) => {
    Logger.Error(`savePendingRecords: ${error}`);
    return error;
  });
}

async function clearPendingRecords(): Promise<void | Error> {
  return AsyncStorage.removeItem(StorageKeys.records).catch((error) => {
    Logger.Error(`clearPendingRecords: ${error}`);
    return error;
  });
}

async function savePendingRecord(record: AlgaeRecord): Promise<void | Error> {
  if (!record) {
    return Promise.resolve();
  }

  // check for other pending records
  const records = await loadPendingRecords();
  records.push(record);
  return savePendingRecords(records);
}

// returns the new list of pending records
async function deletePendingRecord(
  record: AlgaeRecord
): Promise<AlgaeRecord[]> {
  const records = await loadPendingRecords();

  if (!record) {
    return Promise.resolve(records);
  }

  const index = records.findIndex((current) => current.id === record.id);

  if (index !== -1) {
    records.splice(index, 1);
    await savePendingRecords(records);
    return Promise.resolve(records);
  }

  return Promise.resolve(records);
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
): Promise<void | Error> {
  if (!records) {
    return Promise.resolve();
  }

  return AsyncStorage.setItem(
    StorageKeys.cachedRecords,
    JSON.stringify(records)
  ).catch((error) => {
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
): Promise<void | Error> {
  if (!photos) {
    return Promise.resolve();
  }

  return AsyncStorage.setItem(StorageKeys.photos, JSON.stringify(photos)).catch(
    (error) => {
      Logger.Error(`${error}`);
      return error;
    }
  );
}

async function clearPendingPhotos(): Promise<void | Error> {
  return AsyncStorage.removeItem(StorageKeys.photos).catch((error) => {
    Logger.Error(`${error}`);
    return error;
  });
}

async function savePendingPhoto(photo: PendingPhoto): Promise<void | Error> {
  if (!photo) {
    return Promise.resolve();
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
  deletePendingRecord,
  clearPendingRecords,
  loadCachedRecords,
  saveCachedRecords,
  loadPendingPhotos,
  savePendingPhotos,
  clearPendingPhotos,
  savePendingPhoto,
};
