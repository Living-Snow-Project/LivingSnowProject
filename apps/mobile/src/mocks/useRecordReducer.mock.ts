import { makeExampleRecord } from "@livingsnow/record";
import {
  RecordReducerState,
  RecordReducerActions,
} from "../../types/AlgaeRecords";

const makeRecordReducerStateMock = (): RecordReducerState => ({
  state: "Idle",
  seeded: false,
  pendingRecords: [makeExampleRecord("Sighting")],
  downloadedRecords: [],
});

const makeRecordReducerActionsMock = (): RecordReducerActions => ({
  seed: jest.fn(() => Promise.resolve()),
  save: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
  uploadRecord: jest.fn(() => Promise.resolve()),
  downloadRecords: jest.fn(() => Promise.resolve()),
  downloadNextRecords: jest.fn(() => Promise.resolve()),
  retryPendingRecords: jest.fn(() => Promise.resolve()),
  updatePendingRecord: jest.fn(() => Promise.resolve()),
});

export { makeRecordReducerStateMock, makeRecordReducerActionsMock };
