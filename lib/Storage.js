// maybe someday Expo will allow using this package
//import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorage } from 'react-native';
import { map } from 'rsvp';

export default class Storage {

  static keys = {
    appConfig: 'appConfig',
    records: 'records'
  };

  static loadAppConfig() {
    AsyncStorage.getItem(this.keys.appConfig).then((value) => {
      if (value) {
        global.appConfig = JSON.parse(value);
      }
    });
  }

  static saveAppConfig() {
    AsyncStorage.setItem(this.keys.appConfig, JSON.stringify(global.appConfig), (err) => {
      if (err) {
        console.log("error", err);
      }
    });
  }

  static saveDownloadedRecords(param) {

  }

  static loadDownloadedRecords() {

  }

  //
  // when upload fails, save the record and try to upload it later
  // expects a JSON.stringify'd record
  //

  static saveSingleRecord(record) {
    //
    // look for existing records to append onto
    //

    Storage.loadRecords().then((value) => {
      var existingRecords = {records: []};

      if (value) {
        existingRecords = JSON.parse(value);
      }

      existingRecords.records.push(JSON.parse(record));

      AsyncStorage.setItem(this.keys.records, JSON.stringify(existingRecords), (err) => {
        if (err) {
          console.log("error", err);
        }
      });  
    });
  }

  static saveRecords(param) {
    if (param) {
      AsyncStorage.setItem(this.keys.records, JSON.stringify(param), (err) => {
        if (err) {
          console.log("error", err);
        }
      });
    } else {
      AsyncStorage.removeItem(this.keys.records);
    }
  }

  static loadRecords() {
    return AsyncStorage.getItem(this.keys.records);
  }
}
