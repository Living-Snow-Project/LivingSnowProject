import { AlgaeRecord, AppPhoto } from "@livingsnow/record";
import { Asset } from "expo-media-library";

const AlgaeRecordsStatesArray = [
  "Idle",
  "Saving",
  "Seeding",
  "Deleting",
  "Uploading",
  "Downloading",
] as const;

export type AlgaeRecordsStates = typeof AlgaeRecordsStatesArray[number];

// Represents a photo that has been selected from local album.
// parent record has not been uploaded yet (offline scenario).
export type SelectedPhoto = Asset;

// key = record still on user's device (local record id)
export type SelectedPhotos = Map<string, SelectedPhoto[]>;

// Photo saved to disk and parent record uploaded
// recordId = uploaded record id
// This scenario can happen when a user has intermittent cel signal in the wilderness.
export type PendingPhoto = Omit<AppPhoto, "size"> & {
  recordId: string; // uuidv4 of record still in the app
};

// key = record uploaded (cloud record id)
export type PendingPhotos = Map<string, PendingPhoto[]>;

export interface IAlgaeRecords {
  // info
  getDownloadedRecords: () => AlgaeRecord[];
  getCurrentState: () => AlgaeRecordsStates;
  getPendingRecords: () => AlgaeRecord[];
  isSeeded: () => boolean;
  // getPendingPhotos: () => PendingPhoto[];

  // storage actions
  seed: () => Promise<void>;
  save: (record: AlgaeRecord) => Promise<void>;
  delete: (record: AlgaeRecord) => Promise<void>;
  updatePendingRecord: (record: AlgaeRecord) => Promise<void>;

  // network actions
  fullSync: () => Promise<void>; // retryPendingRecords followed by downloadRecords
  uploadRecord: (record: AlgaeRecord, photos: AppPhoto[]) => Promise<void>;
  downloadRecords: () => Promise<void>; // app startup\pull to refresh
  downloadNextRecords: () => Promise<void>; // scrolling
  retryPendingRecords: () => Promise<void>;
}
