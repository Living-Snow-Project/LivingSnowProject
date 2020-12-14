import AsyncStorage from '@react-native-community/async-storage';

const StorageKeys = {
  appConfig: 'appConfig',
  records: 'records',
};

export class Storage {
  static loadAppConfig() {
    AsyncStorage.getItem(StorageKeys.appConfig).then((value) => {
      if (value) {
        global.appConfig = JSON.parse(value);
      }
    });
  }

  static saveAppConfig() {
    AsyncStorage.setItem(StorageKeys.appConfig, JSON.stringify(global.appConfig));
  }

  /* static saveDownloadedRecords(param) {

  }

  static loadDownloadedRecords() {

  } */

  //
  // when upload fails, save the record and try to upload it later
  // expects a JSON.stringify'd record
  //

  static saveSingleRecord(record) {
    //
    // look for existing records to append onto
    //

    Storage.loadRecords().then((value) => {
      let existingRecords = { records: [] };

      if (value) {
        existingRecords = JSON.parse(value);
      }

      existingRecords.records.push(JSON.parse(record));

      AsyncStorage.setItem(StorageKeys.records, JSON.stringify(existingRecords));
    });
  }

  static saveRecords(param) {
    if (param) {
      AsyncStorage.setItem(StorageKeys.records, JSON.stringify(param));
    } else {
      AsyncStorage.removeItem(StorageKeys.records);
    }
  }

  static loadRecords() {
    return AsyncStorage.getItem(StorageKeys.records);
  }
}
