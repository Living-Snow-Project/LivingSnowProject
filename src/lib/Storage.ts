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
async function loadRecords(): Promise<AlgaeRecord[]> {
  return AsyncStorage.getItem(StorageKeys.records)
    .then((value) => (value ? jsonToRecord<AlgaeRecord[]>(value) : []))
    .catch((error) => {
      Logger.Error(`loadRecords: ${error}`);
      return [];
    });
}

async function saveRecords(records: AlgaeRecord[]): Promise<void | Error> {
  if (!records) {
    return Promise.resolve();
  }

  return AsyncStorage.setItem(
    StorageKeys.records,
    JSON.stringify(records)
  ).catch((error) => {
    Logger.Error(`saveRecords: ${error}`);
    return error;
  });
}

async function clearRecords(): Promise<void | Error> {
  return AsyncStorage.removeItem(StorageKeys.records).catch((error) => {
    Logger.Error(`clearRecords: ${error}`);
    return error;
  });
}

async function saveRecord(record: AlgaeRecord): Promise<void | Error> {
  if (!record) {
    return Promise.resolve();
  }

  // check for other pending records
  const records = await loadRecords();
  records.push(record);
  return saveRecords(records);
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

// Photo Storage APIs
async function loadPhotos(): Promise<PendingPhoto[]> {
  return AsyncStorage.getItem(StorageKeys.photos)
    .then((value) => (value ? JSON.parse(value) : []))
    .catch((error) => {
      Logger.Error(`${error}`);
      return [];
    });
}

async function savePhotos(photos: PendingPhoto[]): Promise<void | Error> {
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

async function clearPhotos(): Promise<void | Error> {
  return AsyncStorage.removeItem(StorageKeys.photos).catch((error) => {
    Logger.Error(`${error}`);
    return error;
  });
}

async function savePhoto(photo: PendingPhoto): Promise<void | Error> {
  if (!photo) {
    return Promise.resolve();
  }

  // check for other pending photos
  const photos = await loadPhotos();
  photos.push(photo);
  return savePhotos(photos);
}

export {
  loadAppConfig,
  saveAppConfig,
  loadRecords,
  saveRecords,
  saveRecord,
  clearRecords,
  loadCachedRecords,
  saveCachedRecords,
  loadPhotos,
  savePhotos,
  clearPhotos,
  savePhoto,
};
