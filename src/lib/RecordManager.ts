import * as Network from "./Network";
import {
  loadRecords,
  saveRecord,
  clearRecords,
  loadPhotos,
  savePhoto,
  clearPhotos,
} from "./Storage";
import { Record, jsonToRecord } from "../record/Record";
import Logger from "./Logger";

// TODO: type alignment
// photos[] = {uri: string; width: number; height: number}
async function uploadRecord(record: Record, photos): Promise<Record | string> {
  let uploadPhotoError;
  const localRecord = jsonToRecord(JSON.stringify(record)) as Record;
  localRecord.id = 0;
  return Network.uploadRecord(localRecord)
    .then((response) =>
      photos
        .reduce(
          (promise, photo) =>
            promise.then(() => {
              // picks up the record id of photo associated with
              const wrappedPhoto = { id: response.id, photoStream: photo };
              return Network.uploadPhoto(wrappedPhoto).catch(async (error) => {
                Logger.Warn(`${error}`);
                uploadPhotoError = error;
                await savePhoto(wrappedPhoto);
              });
            }),
          Promise.resolve()
        )
        .then(() => Promise.resolve(response))
    )
    .catch(async (error) => {
      Logger.Warn(`${error}`);
      localRecord.id = record.id;
      localRecord.photoUris = photos;
      await saveRecord(localRecord);
      return Promise.reject(error);
    })
    .finally(() =>
      !uploadPhotoError ? Promise.resolve() : Promise.reject(uploadPhotoError)
    );
}

// uploads photos that were saved while user was offline
async function retryPhotos(): Promise<string | void> {
  return loadPhotos().then(async (photos) => {
    if (photos.length === 0) {
      return Promise.resolve();
    }

    await clearPhotos();

    return photos.reduce(
      (promise, photo) =>
        promise
          .then(() => Network.uploadPhoto(photo))
          .catch(async (error) => {
            Logger.Warn(
              `Network.uploadPhoto rejected: continue photo reducer to prevent data loss: ${error}`
            );
            await savePhoto(photo);
          }),
      Promise.resolve()
    );
  });
}

// uploads records that were saved while user was offline
async function retryRecords(): Promise<void | string | Record> {
  return loadRecords()
    .then(async (records) => {
      if (records.length === 0) {
        return Promise.resolve();
      }

      await clearRecords();

      return records.reduce(
        (promise, record) =>
          promise
            .then(() => {
              const { photoUris } = record;
              /* eslint-disable no-param-reassign */
              record.photoUris = undefined;

              return uploadRecord(record, photoUris);
            })
            .catch((error) =>
              Logger.Warn(
                `uploadRecord rejected: continue records reducer to prevent data loss: ${error}`
              )
            ),
        Promise.resolve()
      );
    })
    .then(() => retryPhotos());
}

export { uploadRecord, retryRecords };
