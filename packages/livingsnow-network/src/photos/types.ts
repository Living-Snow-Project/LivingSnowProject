import { Photo } from "@livingsnow/record/src/types";

// Represents a photo from the app the service is tracking.
// Uri references the the photo in the blob storage container
export type AppPhotoResponse = Photo & {
  size: number;
};

// Micrographs are JPG and the same as AppPhotos in this regard.
// but they will be uploaded by the lab and not via mobile app
export type MicrographResponse = AppPhotoResponse;
