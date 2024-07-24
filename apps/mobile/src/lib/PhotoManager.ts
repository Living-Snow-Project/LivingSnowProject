import { RecordsApiV2 } from "@livingsnow/network";
import { PendingPhoto, SelectedPhoto } from "../../types";
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
  // TODO: how will a saved record -> edit -> remove all photos
  if (selectedPhotos.length == 0) {
    return;
  }

  await Storage.loadSelectedPhotos()
    .then((photos) => photos.set(recordId, selectedPhotos))
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
// TODO: what if record is uploaded but response isn't received? (another case for clientRecordId)
async function uploadSelected(
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

  const failedPhotoUploads: PendingPhoto[] = [];

  // need to upload sequentially because of undocumented "uri" feature in fetch (files arrive corrupted otherwise)
  await selectedPhotos.reduce(async (promise, photo) => {
    try {
      await promise;
      return await RecordsApiV2.postPhoto(cloudRecordId, photo.uri);
    } catch (error) {
      failedPhotoUploads.push(photo);
      // continue with reducer, otherwise failed photos are lost
      return Promise.resolve();
    }
  }, Promise.resolve());

  // save photos that failed to upload
  if (failedPhotoUploads.length > 0) {
    const savedPendingPhotos = await Storage.loadPendingPhotos();

    savedPendingPhotos.set(cloudRecordId, failedPhotoUploads);

    await Storage.savePendingPhotos(savedPendingPhotos);

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

type PendingPhotoArrayElement = { id: string; photos: PendingPhoto[] };

async function retryPending(): Promise<void> {
  const allPendingPhotos = await Storage.loadPendingPhotos();

  if (!allPendingPhotos || allPendingPhotos.size == 0) {
    return;
  }

  const allPendingPhotosArray: PendingPhotoArrayElement[] = [];

  // this sucks but necessary since the photos need to be uploaded sequentially
  // (convert map to array)
  allPendingPhotos.forEach((value, key) =>
    allPendingPhotosArray.push({ id: key, photos: value }),
  );

  // clear the map, insert any failures to re-save at end
  allPendingPhotos.clear();

  await allPendingPhotosArray.reduce(async (promise, currentPending) => {
    const failedPendingPhotos: PendingPhoto[] = [];

    await promise;
    await currentPending.photos.reduce(async (promise2, pending) => {
      try {
        await promise2;
        return await RecordsApiV2.postPhoto(currentPending.id, pending.uri);
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

  await Storage.savePendingPhotos(allPendingPhotos);
}

function createPhotoManager() {
  return {
    addSelected,
    getSelected,
    uploadSelected,
    retryPending,
  };
}

export const PhotoManager = createPhotoManager();
