import { makeExampleRecord } from "@livingsnow/record";
import { IAlgaeRecords } from "../../types/AlgaeRecords";

type ActionMockProps = {
  isEmpty: boolean;
};

const makeRecordReducerActionsMock = (
  { isEmpty }: ActionMockProps = { isEmpty: false }
): IAlgaeRecords => {
  const pendingRecord = makeExampleRecord("Sighting");
  return {
    getDownloadedRecords: () => [],
    getCurrentState: () => "Idle",
    getPendingRecords: () => (isEmpty ? [] : [pendingRecord]),
    isSeeded: () => false,
    seed: jest.fn(() => Promise.resolve()),
    save: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    uploadRecord: jest.fn(() => Promise.resolve()),
    downloadRecords: jest.fn(() => Promise.resolve()),
    downloadNextRecords: jest.fn(() => Promise.resolve()),
    retryPendingRecords: jest.fn(() => Promise.resolve()),
    updatePendingRecord: jest.fn(() => Promise.resolve()),
  };
};

export default makeRecordReducerActionsMock;
