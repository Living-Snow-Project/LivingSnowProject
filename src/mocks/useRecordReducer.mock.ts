import { makeExampleRecord } from "../record/Record";

const makeRecordReducerStateMock = (): RecordReducerState => ({
  seeded: false,
  saving: false,
  seeding: false,
  deleting: false,
  uploading: false,
  downloading: false,
  pendingRecords: [makeExampleRecord("Sighting")],
  downloadedRecords: [],
});

const makeRecordReducerActionsMock = (): RecordReducerActions => ({
  seed: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  uploadRecord: jest.fn(),
  downloadRecords: jest.fn(),
  retryPendingRecords: jest.fn(),
  updatePendingRecord: jest.fn(),
});

export { makeRecordReducerStateMock, makeRecordReducerActionsMock };
