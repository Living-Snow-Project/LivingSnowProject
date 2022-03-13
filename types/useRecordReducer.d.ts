type RecordReducerState = {
  saving: boolean;
  seeded: boolean;
  seeding: boolean;
  deleting: boolean;
  uploading: boolean;
  pendingRecords: AlgaeRecord[];
  // TODO:
  //  downloadedRecords: AlgaeRecord[];
  //  pendingPhotos: Photos[];
};

interface RecordReducerActions {
  seed: () => Promise<void>;
  save: (record: AlgaeRecord) => Promise<void>;
  delete: (record: AlgaeRecord) => Promise<void>;
  uploadRecord: (record: AlgaeRecord, photos: Photo[]) => Promise<void>;
  // TODO:
  // retryPendingRecords: () => Promise<void>;
}
