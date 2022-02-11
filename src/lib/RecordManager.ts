import { uploadRecord, uploadPhoto } from "./Network";
import {
  loadRecords,
  saveRecord,
  clearRecords,
  loadPhotos,
  savePhoto,
  clearPhotos,
} from "./Storage";
import Logger from "./Logger";

class RecordManager {
  static async uploadRecord(record, photoUris) {
    const localRecord = JSON.parse(JSON.stringify(record));
    localRecord.id = 0;
    return uploadRecord(localRecord)
      .then((response) =>
        photoUris
          .reduce(
            (promise, uri) =>
              promise.then(() => {
                const photo = { id: response.id, photoStream: uri };
                return uploadPhoto(photo).catch(async (error) => {
                  Logger.Warn(`${error}`);
                  await savePhoto(photo);
                });
              }),
            Promise.resolve()
          )
          .then(() => Promise.resolve())
      )
      .catch(async (error) => {
        Logger.Warn(`${error}`);
        localRecord.id = record.id;
        localRecord.photoUris = photoUris;
        await saveRecord(localRecord);
        return Promise.reject(error);
      });
  }

  // uploads records that were saved while user was offline
  static async retryRecords() {
    return loadRecords().then(async (records) => {
      if (!records) {
        return;
      }

      await clearRecords();

      records
        .reduce(
          (promise, record) =>
            promise.then(() => {
              const photoUris = record?.photoUris;
              /* eslint-disable no-param-reassign */
              record.photoUris = undefined;

              return RecordManager.uploadRecord(record, photoUris).catch(
                (error) =>
                  Logger.Warn(
                    `continue records reducer to prevent data loss: ${error}`
                  )
              );
            }),
          Promise.resolve()
        )
        .catch((error) => Logger.Error(`error in record reducer: ${error}`));
    });
  }

  // uploads photos that were saved while user was offline
  static async retryPhotos() {
    return loadPhotos().then(async (photos) => {
      if (!photos) {
        return;
      }

      await clearPhotos();

      photos
        .reduce(
          (promise, photo) =>
            promise.then(() =>
              uploadPhoto(photo).catch(async (error) => {
                Logger.Warn(`${error}`);
                await savePhoto(photo);
              })
            ),
          Promise.resolve()
        )
        .catch((error) => Logger.Error(`error in photo reducer: ${error}`));
    });
  }
}

export default RecordManager;
