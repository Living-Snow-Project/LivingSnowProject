import { AppPhoto } from "@livingsnow/record/src/types";

// Represents a photo the service is tracking.
// Uri references the the photo in the blob storage container
export type AppPhotoResponse = AppPhoto & {
  size: number;
};
