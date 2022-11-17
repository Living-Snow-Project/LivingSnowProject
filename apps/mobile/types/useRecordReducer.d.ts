const RecordReducerStatesArray = [
  "Idle",
  "Saving",
  "Seeding",
  "Deleting",
  "Uploading",
  "Downloading",
] as const;

type RecordReducerStates = typeof RecordReducerStatesArray[number];

type RecordReducerState = {
  state: RecordReducerStates;
  seeded: boolean;
  pendingRecords: AlgaeRecord[];
  downloadedRecords: AlgaeRecord[];
  // TODO:
  //  pendingPhotos: Photos[];
};

interface RecordReducerActions {
  seed: () => Promise<void>;
  save: (record: AlgaeRecord) => Promise<void>;
  delete: (record: AlgaeRecord) => Promise<void>;
  uploadRecord: (record: AlgaeRecord, photos: Photo[]) => Promise<void>;
  downloadRecords: () => Promise<void>; // app startup\pull to refresh
  downloadNextRecords: (before: Date) => Promise<void>; // scrolling
  retryPendingRecords: () => Promise<void>;
  updatePendingRecord: (record: AlgaeRecord) => Promise<void>;
}
