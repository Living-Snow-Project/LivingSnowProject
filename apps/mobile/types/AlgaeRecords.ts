import { AlgaeRecord, AppPhoto } from "@livingsnow/record";
import { DataResponseV2 } from "@livingsnow/network";
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

// key = local algae record id
export type SelectedPhotos = Map<string, SelectedPhoto[]>;

// Photo saved to disk and parent record uploaded
// This scenario can happen when a user has intermittent cel signal in the wilderness.
export type PendingPhoto = Omit<AppPhoto, "size">;

// key = cloud algae record id
export type PendingPhotos = Map<string, PendingPhoto[]>;

// TODO: better semantics, ie.
// CloudAlgaeRecord
// CloudPhoto

export type LocalAlgaeRecord = {
  record: AlgaeRecord;
  photos: SelectedPhoto[] | undefined;
};

export interface IAlgaeRecords {
  // info
  getCurrentState: () => AlgaeRecordsStates;
  getDownloaded: () => DataResponseV2[];
  getPending: () => LocalAlgaeRecord[];
  isSeeded: () => boolean;

  // storage actions
  seed: () => Promise<void>; // cached records
  delete: (recordId: string) => Promise<void>; // pending records

  // network actions
  fullSync: () => Promise<void>; // retryPending followed by download
  download: () => Promise<void>; // app startup / pull to refresh
  downloadNext: () => Promise<void>; // "infinite" scrolling
  retryPending: () => Promise<void>;
}
