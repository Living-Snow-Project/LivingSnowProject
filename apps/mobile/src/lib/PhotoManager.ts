import { RecordsApiV2 } from "@livingsnow/network";
import { PendingPhoto, SelectedPhoto } from "../../types";
import {
  loadPendingPhotos,
  loadSelectedPhotos,
  savePendingPhotos,
  saveSelectedPhotos,
} from "./Storage";

export async function addSelectedPhotos(
  recordId: string,
  selectedPhotos: SelectedPhoto[]
) {
  // TODO: how will a saved record -> edit -> remove all photos
  if (selectedPhotos.length == 0) {
    return;
  }

  await loadSelectedPhotos()
    .then((photos) => photos.set(recordId, selectedPhotos))
    .then((photos) => saveSelectedPhotos(photos));
}

export async function getSelectedPhotos(
  recordId: string
): Promise<SelectedPhoto[] | undefined> {
  const selectedPhotos = await loadSelectedPhotos();
  return selectedPhotos.get(recordId);
}

// only call this after the record is uploaded
// once the record is uploaded, the photo is promoted from Selected to Pending
// TODO: what if record is uploaded but response isn't received? (another case for clientRecordId)
export async function uploadSelectedPhotos(
  localRecordId: string,
  cloudRecordId: string
): Promise<void> {
  const allSelectedPhotos = await loadSelectedPhotos();
  const selectedPhotos = allSelectedPhotos.get(localRecordId);

  if (!selectedPhotos || selectedPhotos.length == 0) {
    return;
  }

  // assign cloud record id
  const pendingPhotos: PendingPhoto[] = selectedPhotos.map((value) => ({
    ...value,
    recordId: cloudRecordId,
  }));

  // promote selected to pending
  allSelectedPhotos.delete(localRecordId);
  await saveSelectedPhotos(allSelectedPhotos);

  const failedPhotoUploads: PendingPhoto[] = [];

  // need to upload sequentially because of undocumented "uri" feature in fetch (files arrive corrupted otherwise)
  await pendingPhotos.reduce(async (promise, photo) => {
    try {
      await promise;
      return await RecordsApiV2.postPhoto(photo.recordId, photo.uri);
    } catch (error) {
      failedPhotoUploads.push(photo);
      // continue with reducer, otherwise failed photos are lost
      return Promise.resolve();
    }
  }, Promise.resolve());

  // save photos that failed to upload
  if (failedPhotoUploads.length > 0) {
    const savedPendingPhotos = await loadPendingPhotos();

    savedPendingPhotos.set(cloudRecordId, failedPhotoUploads);

    await savePendingPhotos(savedPendingPhotos);
  }
}

type PendingPhotoArrayElement = { id: string; photos: PendingPhoto[] };

export async function retryAllPendingPhotos(): Promise<void> {
  const allPendingPhotos = await loadPendingPhotos();

  if (!allPendingPhotos || allPendingPhotos.size == 0) {
    return;
  }

  const allPendingPhotosArray: PendingPhotoArrayElement[] = [];

  // this sucks but necessary since the photos need to be uploaded sequentially
  // (convert map to array)
  allPendingPhotos.forEach((value, key) =>
    allPendingPhotosArray.push({ id: key, photos: value })
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

  await savePendingPhotos(allPendingPhotos);
}
