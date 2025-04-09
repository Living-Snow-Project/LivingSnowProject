import { AlgaeRecord, AlgaeRecordV3, Photo } from "@livingsnow/record";
import { DataResponseV3 } from "@livingsnow/network";
import { Asset } from "expo-media-library";

const AlgaeRecordsStatesArray = [
  "Idle",
  "Saving",
  "Seeding",
  "Deleting",
  "Uploading",
  "Downloading",
] as const;

export type AlgaeRecordsStates = (typeof AlgaeRecordsStatesArray)[number];

// Represents a photo that has been selected from local album.
// parent record has not been uploaded yet (offline scenario).
export type SelectedPhoto = Asset;

// key = local algae record id
export type SelectedPhotos = Map<string, SelectedPhoto[]>;

// TODO: in 2026, assume no old clients exist and make the V3 type the only type

// Photo saved to disk and parent record uploaded
// This scenario can happen when a user has intermittent cel signal in the wilderness.
export type PendingPhoto = Photo;

export type PendingPhotoV3 = PendingPhoto & {
  requestId: string; // used to track the upload request
};

// key = cloud algae record id
export type PendingPhotos = Map<string, PendingPhoto[]>;

export type PendingPhotosV3 = Map<string, PendingPhotoV3[]>;

// for rendering TimelineRow
export type MinimalAlgaeRecord = {
  record: AlgaeRecord;
  photos?: Photo[]; // could be SelectedPhoto or Photo
};

export type MinimalAlgaeRecordV3 = {
  record: AlgaeRecordV3;
  photos?: Photo[]; // could be SelectedPhoto or Photo
};

// for PendingRecords
export type LocalAlgaeRecord = {
  record: AlgaeRecord;
  photos: SelectedPhoto[] | undefined;
};

export type LocalAlgaeRecordV3 = {
  record: AlgaeRecordV3;
  requestId: string; // used to track the upload request
  photos: SelectedPhoto[] | undefined;
};

export interface IAlgaeRecords {
  // info
  getCurrentState: () => AlgaeRecordsStates;
  getDownloaded: () => DataResponseV3[];
  getPending: () => LocalAlgaeRecordV3[];
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
