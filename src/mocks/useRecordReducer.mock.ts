import { makeExampleRecord } from "../record/Record";

const recordReducerStateMock: RecordReducerState = {
  seeded: false,
  saving: false,
  seeding: false,
  deleting: false,
  uploading: false,
  pendingRecords: [makeExampleRecord("Sighting")],
};

const recordReducerActionsMock: RecordReducerActions = {
  seed: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  uploadRecord: jest.fn(),
};

export { recordReducerStateMock, recordReducerActionsMock };
