import { Network } from './Network';
import { Storage } from './Storage';

export class RecordManager {
  static async uploadRecord(record, photoUris) {
    return Network.uploadRecord(record)
    .then(response => {
      return photoUris.reduce((promise, uri) => {
        return promise.then(() => {
          let photo = {id: response.id, photoStream: uri};
          return Network.uploadPhoto(photo).catch(async error => {
            console.log(error);
            await Storage.savePhoto(photo);
          })
        })
      }, Promise.resolve()).then(() => Promise.resolve());
    })
    .catch(async error => {
      console.log(error);
      record.photoUris = photoUris;
      await Storage.saveRecord(record);
      return Promise.reject(error);
    });
  }

  // uploads records that were saved while user was offline
  static async retryRecords() {
    return Storage.loadRecords().then(async records => {
      if (!records) {
        return;
      }

      await Storage.clearRecords();
      
      records.reduce((promise, record) => {
        return promise.then(() => {
          let photoUris = record?.photoUris;
          record.photoUris = null;

          return RecordManager.uploadRecord(record, photoUris)
          .catch(error => console.log(`continue records reducer to prevent data loss: ${error}`));
        });
      }, Promise.resolve())
      .catch(error => console.log(`error in record reducer: ${error}`));
    });
  }

  // uploads photos that were saved while user was offline
  static async retryPhotos() {
    return Storage.loadPhotos().then(async photos => {
      if (!photos) {
        return;
      }

      await Storage.clearPhotos();

      photos.reduce((promise, photo) => {
        return promise.then(() => {
          return Network.uploadPhoto(photo).catch(error => {
            console.log(error);
            Storage.savePhoto(photo);
          });
        });
      }, Promise.resolve())
      .catch(error => console.log(`error in photo reducer: ${error}`));
    });
  }
}
