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
