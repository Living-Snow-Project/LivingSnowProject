import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
  appConfig: 'appConfig',
  records: 'records',
  photos: 'photos'
};

export class Storage {
  //
  // AppConfig Storage APIs
  //
  
  static async loadAppConfig() {
    return AsyncStorage.getItem(StorageKeys.appConfig).then(value => {
      if (value) {
        global.appConfig = JSON.parse(value);
      }
    });
  }

  static saveAppConfig() {
    AsyncStorage.setItem(StorageKeys.appConfig, JSON.stringify(global.appConfig));
  }

  //
  // Record Storage APIs
  //

  static async loadRecords() {
    return AsyncStorage.getItem(StorageKeys.records).then(value => {
      if (value) {
        return JSON.parse(value);
      }

      return [];
    })
    .catch(error => {
      return error;
    });
  }

  static saveRecords(records) {
    if (records) {
      AsyncStorage.setItem(StorageKeys.records, JSON.stringify(records));
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
    let records = await Storage.loadRecords();
    records.push(record);
    Storage.saveRecords(records);
  }

  //
  // Photo Storage APIs
  //

  static async loadPhotos() {
    return AsyncStorage.getItem(StorageKeys.photos).then(value => {
      if (value) {
        return JSON.parse(value);
      }

      return [];
    })
    .catch(error => {
      return error;
    });
  }

  static async savePhotos(photos) {
    if (photos) {
      AsyncStorage.setItem(StorageKeys.photos, JSON.stringify(photos));
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
    let photos = await Storage.loadPhotos();
    photos.push(photo);
    Storage.savePhotos(photos);
  }
}
