import { v7 as uuidv7 } from "uuid";
import { RecordsApiV3 } from "@livingsnow/network";
import { PendingPhotoV3, SelectedPhoto } from "../../types";
import * as Storage from "./Storage";
import { Notifications } from "../constants";

type UploadErrorInfo = {
  id: string;
  title: string;
  message: string;
};

export class UploadError extends Error {
  errorInfo: UploadErrorInfo;

  constructor(info: UploadErrorInfo) {
    super();

    this.errorInfo = { ...info };
  }
}

// TODO: setSelected
async function addSelected(recordId: string, selectedPhotos: SelectedPhoto[]) {
  // TODO: test a saved record -> edit -> remove all photos
  // this is likely a bug
  // the concern is the selected photos are not actually removed from storage
  if (selectedPhotos.length == 0) {
    return;
  }

  await Storage.loadSelectedPhotos()
    .then((photos) => {
      /*const existing = photos.get(recordId);

      // remove existing from MMKV
      if (existing) {
        existing.forEach((photo) => {
          // look up in MMKV and remove (if it's not in the new list?)
        });
      }

      // load each to base64 and save to MMKV
      selectedPhotos.forEach((photo) => {
        // read to base64
        // save in MMKV
      });*/

      return photos.set(recordId, selectedPhotos);
    })
    .then((photos) => Storage.saveSelectedPhotos(photos));
}

async function getSelected(
  recordId: string,
): Promise<SelectedPhoto[] | undefined> {
  const selectedPhotos = await Storage.loadSelectedPhotos();
  return selectedPhotos.get(recordId);
}

// only call this after the record is uploaded
// once the record is uploaded, the photo is promoted from Selected to Pending
// v3 API now implements "requestId" to track the upload request
async function uploadSelectedV3(
  localRecordId: string,
  cloudRecordId: string,
): Promise<void> {
  const allSelectedPhotos = await Storage.loadSelectedPhotos();
  const selectedPhotos = allSelectedPhotos.get(localRecordId);

  if (!selectedPhotos || selectedPhotos.length == 0) {
    return;
  }

  // promote selected to pending
  allSelectedPhotos.delete(localRecordId);
  await Storage.saveSelectedPhotos(allSelectedPhotos);

  const failedPhotoUploads: PendingPhotoV3[] = [];

  // OLD: needed to upload sequentially because of undocumented "uri" feature in fetch (files arrive corrupted otherwise)
  // TODO: refactor with "for... of" loop
  await selectedPhotos.reduce(async (promise, photo) => {
    const requestId = uuidv7();
    try {
      await promise;
      // TODO: delete the photo? (from /cache)
      // TODO: read base64 string from MMKV
      // TODO: need a new RecordsApiV3.postPhoto() that takes the base64 string
      return await RecordsApiV3.postPhoto(cloudRecordId, photo.uri, requestId);
    } catch (error) {
      failedPhotoUploads.push({ ...photo, requestId });
      // continue with reducer, otherwise failed photos are lost
      return Promise.resolve();
    }
  }, Promise.resolve());

  // save photos that failed to upload
  if (failedPhotoUploads.length > 0) {
    const savedPendingPhotos = await Storage.loadPendingPhotosV3();

    savedPendingPhotos.set(cloudRecordId, failedPhotoUploads);

    await Storage.savePendingPhotosV3(savedPendingPhotos);

    // singular error message
    if (failedPhotoUploads.length == 1) {
      throw new UploadError({
        id: cloudRecordId,
        title: Notifications.uploadPhotoFailed.title,
        message: Notifications.uploadPhotoFailed.message,
      });
    }

    // plural error message
    throw new UploadError({
      id: cloudRecordId,
      title: Notifications.uploadPhotosFailed.title,
      message: Notifications.uploadPhotosFailed.message,
    });
  }
}

type PendingPhotoArrayElementV3 = { id: string; photos: PendingPhotoV3[] };

async function retryPendingV3(): Promise<void> {
  const allPendingPhotos = await Storage.loadPendingPhotosV3();

  if (!allPendingPhotos || allPendingPhotos.size == 0) {
    return;
  }

  const allPendingPhotosArray: PendingPhotoArrayElementV3[] = [];

  // this sucks but necessary since the photos need to be uploaded sequentially
  // (convert map to array)
  allPendingPhotos.forEach((value, key) =>
    allPendingPhotosArray.push({ id: key, photos: value }),
  );

  // clear the map, insert any failures to re-save at end
  allPendingPhotos.clear();

  // TODO: refactor with "for...of"
  await allPendingPhotosArray.reduce(async (promise, currentPending) => {
    const failedPendingPhotos: PendingPhotoV3[] = [];

    await promise;
    await currentPending.photos.reduce(async (promise2, pending) => {
      try {
        await promise2;
        // TODO: read from MMKV
        return await RecordsApiV3.postPhoto(
          currentPending.id,
          pending.uri,
          pending.requestId,
        );
      } catch (e) {
        failedPendingPhotos.push(pending);
        // continue reducer to avoid data loss
        return Promise.resolve();
      }
    }, Promise.resolve());

    if (failedPendingPhotos.length > 0) {
      allPendingPhotos.set(currentPending.id, failedPendingPhotos);
    }

    return Promise.resolve();
  }, Promise.resolve());

  await Storage.savePendingPhotosV3(allPendingPhotos);
}

function createPhotoManager() {
  return {
    addSelected,
    getSelected,
    uploadSelectedV3,
    retryPendingV3,
  };
}

export const PhotoManager = createPhotoManager();
