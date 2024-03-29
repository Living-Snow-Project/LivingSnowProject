import { AlgaeRecord, Photo } from "@livingsnow/record";

const AlgaeRecordsStatesArray = [
  "Idle",
  "Saving",
  "Seeding",
  "Deleting",
  "Uploading",
  "Downloading",
] as const;

export type AlgaeRecordsStates = typeof AlgaeRecordsStatesArray[number];

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
  uploadRecord: (record: AlgaeRecord, photos: Photo[]) => Promise<void>;
  downloadRecords: () => Promise<void>; // app startup\pull to refresh
  downloadNextRecords: () => Promise<void>; // scrolling
  retryPendingRecords: () => Promise<void>;
}
