import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageKeys = {
  appConfig: "appConfig",
  records: "records",
  photos: "photos",
};

class Storage {
  // AppConfig Storage APIs
  static async loadAppConfig() {
    return AsyncStorage.getItem(StorageKeys.appConfig).then((value) =>
      value ? JSON.parse(value) : null
    );
  }

  static saveAppConfig(appSettings) {
    AsyncStorage.setItem(StorageKeys.appConfig, JSON.stringify(appSettings));
  }

  // Record Storage APIs
  static async loadRecords() {
    return AsyncStorage.getItem(StorageKeys.records)
      .then((value) => (value ? JSON.parse(value) : []))
      .catch((error) => error);
  }

  static async saveRecords(records) {
    if (records) {
      await AsyncStorage.setItem(StorageKeys.records, JSON.stringify(records));
    }
  }

  static async clearRecords() {
    await AsyncStorage.removeItem(StorageKeys.records);
  }

  static async saveRecord(record) {
    if (!record) {
      return;
    }

    // check for other pending records
    const records = await Storage.loadRecords();
    records.push(record);
    await Storage.saveRecords(records);
  }

  // Photo Storage APIs
  static async loadPhotos() {
    return AsyncStorage.getItem(StorageKeys.photos)
      .then((value) => (value ? JSON.parse(value) : []))
      .catch((error) => error);
  }

  static async savePhotos(photos) {
    if (photos) {
      await AsyncStorage.setItem(StorageKeys.photos, JSON.stringify(photos));
    }
  }

  static async clearPhotos() {
    await AsyncStorage.removeItem(StorageKeys.photos);
  }

  static async savePhoto(photo) {
    if (!photo) {
      return;
    }

    // check for other pending photos
    const photos = await Storage.loadPhotos();
    photos.push(photo);
    await Storage.savePhotos(photos);
  }
}

export default Storage;
