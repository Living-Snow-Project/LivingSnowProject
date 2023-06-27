import { AppPhoto } from "@livingsnow/record";

// Represents a photo that has been selected from expo-images-picker but it and parent
// record have not been uploaded yet (offline scenario).
export type PendingPhoto = AppPhoto & {
  recordId: string; // uuidv4 of record still in the app
  selectedId: string; // id returned from expo-images-picker
};

// Photo saved to disk but its parent record was uploaded
// recordId = uploaded record id
// This scenario can happen when a user has intermittent cel signal in the wilderness.
export type OrphanedPhoto = Omit<PendingPhoto, "selectedId">;

type PendingPhotoStorage = {
  recordId: string;
  photos: PendingPhoto[];
};

// recordId, selected photos[]
// read Map from disk
const pendingPhotosMap = new Map<string, PendingPhoto[]>();

export function addPendingPhotos(
  recordId: string,
  pendingPhotos: PendingPhoto[]
) {
  // const pendingPhotosMap = loadPendingPhotos();

  pendingPhotosMap.set(recordId, pendingPhotos);

  // savePendingPhotos(pendingPhotosMap);
}

export function getPendingPhotos(recordId: string): PendingPhoto[] | undefined {
  // const pendingPhotosMap = loadPendingPhotos();
  return pendingPhotosMap.get(recordId);
}

// once the record is uploaded, the photo is orphaned
export function uploadPendingPhotos(
  existingRecordId: string,
  newRecordId: string
): void {
  // const pendingPhotosMap = loadPendingPhotos();
  // const orphanedPhotos = loadOrphanedPhotos();

  // code below is wrong, move pending to orphaned after remap, and delete from pending
  const photos = pendingPhotosMap.get(existingRecordId);

  if (!photos) {
    return;
  }

  const newPhotos: PendingPhotoStorage = {} as PendingPhotoStorage;
  newPhotos.recordId = newRecordId;

  photos.forEach((value) => newPhotos.photos.push({ ...value }));

  // pendingPhotosMap.set(newPhotos.recordId, newPhotos.photos);
  pendingPhotosMap.delete(existingRecordId);

  // savePendingPhotos(pendingPhotosMap);

  // do uploads here, save to Ophaned Photos is fail

  // saveOrphanedPhotos(...)
}
