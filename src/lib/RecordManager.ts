import * as Network from "./Network";
import {
  loadRecords,
  saveRecord,
  clearRecords,
  loadPhotos,
  savePhoto,
  clearPhotos,
} from "./Storage";
import { jsonToRecord } from "../record/Record";
import Logger from "./Logger";

// returns the AlgaeRecord server responds with
// rejects with an error string
async function uploadRecord(
  record: AlgaeRecord,
  photos: Photo[]
): Promise<AlgaeRecord> {
  let uploadPhotoError;
  const localRecord = jsonToRecord<AlgaeRecord>(JSON.stringify(record));
  localRecord.id = 0;
  return Network.uploadRecord(localRecord)
    .then((response) =>
      photos
        .reduce(
          (promise, photo) =>
            promise.then(() => {
              // picks up the record id of photo associated with
              const pendingPhoto: PendingPhoto = { id: response.id, ...photo };
              return Network.uploadPhoto(pendingPhoto).catch(async (error) => {
                Logger.Warn(`${error}`);
                uploadPhotoError = error;
                await savePhoto(pendingPhoto);
              });
            }),
          Promise.resolve()
        )
        .then(() => Promise.resolve(response))
    )
    .catch(async (error) => {
      Logger.Warn(`${error}`);
      localRecord.id = record.id;
      localRecord.photos = photos;
      await saveRecord(localRecord);
      return Promise.reject(error);
    })
    .finally(() =>
      !uploadPhotoError ? Promise.resolve() : Promise.reject(uploadPhotoError)
    );
}

// uploads photos that were saved while user was offline
async function retryPhotos(): Promise<void> {
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
// returns the current array of pending records
async function retryPendingRecords(): Promise<AlgaeRecord[]> {
  return loadRecords()
    .then(async (records) => {
      if (records.length === 0) {
        return Promise.resolve([]);
      }

      await clearRecords();

      return records.reduce(
        (promise, record) =>
          promise
            .then(() => {
              const { photos } = record;
              // @ts-ignore (currently photos will always be [] and never undefined)
              return uploadRecord(record, photos);
            })
            .catch((error) =>
              Logger.Warn(
                `uploadRecord rejected: continue records reducer to prevent data loss: ${error}`
              )
            ),
        Promise.resolve()
      );
    })
    .then(() => retryPhotos().then(() => loadRecords()));
}

export { uploadRecord, retryPendingRecords };
