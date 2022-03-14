type RecordReducerState = {
  saving: boolean;
  seeded: boolean;
  seeding: boolean;
  deleting: boolean;
  uploading: boolean;
  downloading: boolean;
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
  downloadRecords: () => Promise<void>;
  retryPendingRecords: () => Promise<void>;
}
