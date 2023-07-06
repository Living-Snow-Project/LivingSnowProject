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
  await loadSelectedPhotos()
    .then((photos) => photos.set(recordId, selectedPhotos))
    .then((photos) => saveSelectedPhotos(photos));
}

export async function getSelectedPhotos(
  recordId: string
): Promise<SelectedPhoto[] | undefined> {
  const sendingPhotos = await loadSelectedPhotos();
  return sendingPhotos.get(recordId);
}

// once the record is uploaded, the photo is "orphaned"
// only call this after the record is uploaded
// TODO: what if record is uploaded but response isn't received? (another case for clientRecordId)
export async function uploadSelectedPhotos(
  localRecordId: string,
  cloudRecordId: string
): Promise<void> {
  const allSelectedPhotos = await loadSelectedPhotos();
  const selectedPhotos = await allSelectedPhotos.get(localRecordId);

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

  // TODO: 99% sure this needs to be reduce
  pendingPhotos.forEach(async (photo) => {
    try {
      await RecordsApiV2.postPhoto(photo.recordId, photo.uri);
    } catch (error) {
      failedPhotoUploads.push(photo);
    }
  });

  if (failedPhotoUploads.length > 0) {
    const savedPendingPhotos = await loadPendingPhotos();

    savedPendingPhotos.set(cloudRecordId, failedPhotoUploads);

    await savePendingPhotos(savedPendingPhotos);
  }
}
