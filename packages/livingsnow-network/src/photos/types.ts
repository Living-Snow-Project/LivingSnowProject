import { Photo } from "@livingsnow/record/src/types";

// Represents a photo from the app the service is tracking.
// Uri references the the photo in the blob storage container
export type AppPhotoResponse = Photo & {
  size: number;
};

// Micrographs are JPG and the same as AppPhotos in this regard.
// but they will be uploaded by the lab and not via mobile app
// micrographId introduced because the Photo.uri field set to original file name of the micrograph
export type MicrographResponse = AppPhotoResponse & {
  micrographId: number; // needed for DELETE API (uri is original file name of micrograph)
};
