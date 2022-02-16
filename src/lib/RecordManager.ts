import * as Network from "./Network";
import {
  loadRecords,
  saveRecord,
  clearRecords,
  loadPhotos,
  savePhoto,
  clearPhotos,
} from "./Storage";
import { Record } from "../record/Record";
import Logger from "./Logger";

// TODO: type alignment
// photos[] = {uri: string; width: number; height: number}
async function uploadRecord(record, photos): Promise<Record | string> {
  const localRecord = JSON.parse(JSON.stringify(record));
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
    });
}

// uploads records that were saved while user was offline
async function retryRecords(): Promise<void> {
  return loadRecords().then(async (records) => {
    if (!records) {
      return;
    }

    await clearRecords();

    records
      .reduce(
        (promise, record) =>
          promise.then(() => {
            const { photoUris } = record;
            /* eslint-disable no-param-reassign */
            record.photoUris = undefined;

            return uploadRecord(record, photoUris).catch((error) =>
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
async function retryPhotos(): Promise<void> {
  return loadPhotos().then(async (photos) => {
    if (!photos) {
      return;
    }

    await clearPhotos();

    photos
      .reduce(
        (promise, photo) =>
          promise.then(() =>
            Network.uploadPhoto(photo).catch(async (error) => {
              Logger.Warn(`${error}`);
              await savePhoto(photo);
            })
          ),
        Promise.resolve()
      )
      .catch((error) => Logger.Error(`error in photo reducer: ${error}`));
  });
}

export { uploadRecord, retryRecords, retryPhotos };
