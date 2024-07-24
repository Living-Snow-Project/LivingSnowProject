import { makeExampleRecord } from "@livingsnow/record";
import { IAlgaeRecords, LocalAlgaeRecord } from "../../types/AlgaeRecords";

type ActionMockProps = {
  isEmpty: boolean;
};

export const makeAlgaeRecordsMock = (
  { isEmpty }: ActionMockProps = { isEmpty: false },
): IAlgaeRecords => {
  const pendingRecord: LocalAlgaeRecord = {
    record: makeExampleRecord("Sighting"),
    photos: undefined,
  };
  return {
    getCurrentState: () => "Idle",
    getDownloaded: () => [],
    getPending: () => (isEmpty ? [] : [pendingRecord]),
    isSeeded: () => false,

    seed: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),

    fullSync: jest.fn(() => Promise.resolve()),
    download: jest.fn(() => Promise.resolve()),
    downloadNext: jest.fn(() => Promise.resolve()),
    retryPending: jest.fn(() => Promise.resolve()),
  };
};
