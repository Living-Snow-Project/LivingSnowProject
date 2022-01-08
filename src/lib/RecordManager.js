import { Network } from "./Network";
import Storage from "./Storage";
import Logger from "./Logger";

class RecordManager {
  static async uploadRecord(record, photoUris) {
    const localRecord = JSON.parse(JSON.stringify(record));
    localRecord.id = 0;
    return Network.uploadRecord(localRecord)
      .then((response) =>
        photoUris
          .reduce(
            (promise, uri) =>
              promise.then(() => {
                const photo = { id: response.id, photoStream: uri };
                return Network.uploadPhoto(photo).catch(async (error) => {
                  Logger.Warn(JSON.stringify(error));
                  await Storage.savePhoto(photo);
                });
              }),
            Promise.resolve()
          )
          .then(() => Promise.resolve())
      )
      .catch(async (error) => {
        Logger.Warn(JSON.stringify(error));
        localRecord.id = record.id;
        localRecord.photoUris = photoUris;
        await Storage.saveRecord(localRecord);
        return Promise.reject(error);
      });
  }

  // uploads records that were saved while user was offline
  static async retryRecords() {
    return Storage.loadRecords().then(async (records) => {
      if (!records) {
        return;
      }

      await Storage.clearRecords();

      records
        .reduce(
          (promise, record) =>
            promise.then(() => {
              const photoUris = record?.photoUris;
              /* eslint-disable no-param-reassign */
              record.photoUris = null;

              return RecordManager.uploadRecord(record, photoUris).catch(
                (error) =>
                  Logger.Warn(
                    `continue records reducer to prevent data loss: ${JSON.stringify(
                      error
                    )}`
                  )
              );
            }),
          Promise.resolve()
        )
        .catch((error) =>
          Logger.Error(`error in record reducer: ${JSON.stringify(error)}`)
        );
    });
  }

  // uploads photos that were saved while user was offline
  static async retryPhotos() {
    return Storage.loadPhotos().then(async (photos) => {
      if (!photos) {
        return;
      }

      await Storage.clearPhotos();

      photos
        .reduce(
          (promise, photo) =>
            promise.then(() =>
              Network.uploadPhoto(photo).catch((error) => {
                Logger.Warn(JSON.stringify(error));
                Storage.savePhoto(photo);
              })
            ),
          Promise.resolve()
        )
        .catch((error) =>
          Logger.Error(`error in photo reducer: ${JSON.stringify(error)}`)
        );
    });
  }
}

export default RecordManager;
