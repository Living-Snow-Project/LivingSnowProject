import {
  AlgaeRecord,
  makeExamplePhoto,
  makeExampleRecord,
} from "@livingsnow/record";
import { RecordReducerStates } from "../../../types/AppState";
import { reducer, recordReducerActionsDispatch } from "../useRecordReducer";
import { makeRecordReducerStateMock } from "../../mocks/useRecordReducer.mock";
import * as RecordManager from "../../lib/RecordManager";

// TODO: works for now but look into exporting a mock (ie. like AsyncStorage)
jest.mock("@livingsnow/network");
const Network = require("@livingsnow/network");

const defaultState: RecordReducerStates = "Idle";

describe("useRecordReducer test suite", () => {
  describe("dispatch tests", () => {
    let dispatch;
    beforeEach(() => {
      dispatch = recordReducerActionsDispatch.dispatch;
      recordReducerActionsDispatch.dispatch = jest.fn();
    });

    afterEach(() => {
      recordReducerActionsDispatch.dispatch = dispatch;
    });

    // TODO: consider additional assertions (ie. "toBeCalledWith")
    // TODO: failure scenarios
    test("seed action", async () => {
      await recordReducerActionsDispatch.seed();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("save action", async () => {
      await recordReducerActionsDispatch.save(makeExampleRecord("Sighting"));
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("delete action", async () => {
      await recordReducerActionsDispatch.delete(makeExampleRecord("Sighting"));
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("uploading action", async () => {
      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockImplementationOnce((record: AlgaeRecord) =>
          Promise.resolve(record)
        );

      return recordReducerActionsDispatch
        .uploadRecord(makeExampleRecord("Sample"), [makeExamplePhoto()])
        .then(() => {
          expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(
            2
          );
          expect(uploadMock).toHaveBeenCalledTimes(1);
          uploadMock.mockReset();
        });
    });

    test("uploading action fails", async () => {
      const record = makeExampleRecord("Sample");
      const photo = makeExamplePhoto();
      const uploadMock = jest
        .spyOn(RecordManager, "uploadRecord")
        .mockRejectedValueOnce({
          pendingRecords: [photo],
          pendingPhotos: [record],
        });

      return recordReducerActionsDispatch
        .uploadRecord(record, [photo])
        .then(() => {
          fail(
            "recordReducerActionsDispatch.uploadRecord was expected to reject"
          );
        })
        .catch(() => {
          expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(
            2
          );
          expect(uploadMock).toHaveBeenCalledTimes(1);
          uploadMock.mockReset();
        });
    });

    test("downloadRecords action succeeds", async () => {
      jest.spyOn(Network, "downloadRecords").mockResolvedValueOnce([]);
      await recordReducerActionsDispatch.downloadRecords();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("downloadRecords action fails", async () => {
      jest.spyOn(Network, "downloadRecords").mockRejectedValueOnce("");
      await recordReducerActionsDispatch.downloadRecords();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("downloadNextRecords action succeeds", async () => {
      jest.spyOn(Network, "downloadRecords").mockResolvedValueOnce([]);
      await recordReducerActionsDispatch.downloadNextRecords(
        new Date("2022-03-26")
      );
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("downloadNextRecords action fails", async () => {
      jest.spyOn(Network, "downloadRecords").mockRejectedValueOnce("");
      await recordReducerActionsDispatch.downloadNextRecords(
        new Date("2022-03-26")
      );
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("retryPendingRecords action", async () => {
      await recordReducerActionsDispatch.retryPendingRecords();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("updatePendingRecord action", async () => {
      const record = makeExampleRecord("Sighting");
      await recordReducerActionsDispatch.save(record);
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
      record.tubeId = "new tubeId";
      await recordReducerActionsDispatch.updatePendingRecord(record);
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(4);
    });
  });

  describe("reducer tests", () => {
    const payload = {
      pendingPhotos: [],
      pendingRecords: [],
      downloadedRecords: [],
    };

    test("start seeding", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_SEEDING",
        payload,
      });
      expect(state.state).toBe("Seeding");
    });

    test("end seeding", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_SEEDING",
        payload,
      });
      expect(state.state).toBe(defaultState);
      expect(state.seeded).toBe(true);
    });

    test("start saving", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_SAVING",
        payload,
      });
      expect(state.state).toBe("Saving");
    });

    test("end saving", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_SAVING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start deleting", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_DELETING",
        payload,
      });
      expect(state.state).toBe("Deleting");
    });

    test("end deleting", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DELETING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start uploading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_UPLOAD_RECORD",
        payload,
      });
      expect(state.state).toBe("Uploading");
    });

    test("end uploading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_UPLOAD_RECORD",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start downloading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_DOWNLOADING",
        payload,
      });
      expect(state.state).toBe("Downloading");
    });

    test("end downloading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DOWNLOADING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("end downloading failed", () => {
      // @ts-expect-error
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DOWNLOADING",
      });
      expect(state.state).toBe(defaultState);
    });

    test("end downloading next", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DOWNLOADING_NEXT",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start retry pending records", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_RETRY",
        payload,
      });
      expect(state.state).toBe("Uploading");
    });

    test("end retry pending records", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_RETRY",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("unknown action", () => {
      let didThrow = false;

      try {
        reducer(makeRecordReducerStateMock(), {
          // @ts-ignore
          type: "garbage",
        });
      } catch (error) {
        didThrow = true;
      }

      expect(didThrow).toBe(true);
    });
  });
});
