import { makeExamplePhoto } from "../../record/Photo";
import { makeExampleRecord } from "../../record/Record";
import { reducer, recordReducerActionsDispatch } from "../useRecordReducer";
import { makeRecordReducerStateMock } from "../../mocks/useRecordReducer.mock";
import * as RecordManager from "../../lib/RecordManager";
import * as Network from "../../lib/Network";

describe("useRecordStorage test suite", () => {
  describe("dispatch tests", () => {
    let dispatch;
    beforeEach(() => {
      dispatch = recordReducerActionsDispatch.dispatch;
      recordReducerActionsDispatch.dispatch = jest.fn();
    });

    afterEach(() => {
      recordReducerActionsDispatch.dispatch = dispatch;
    });

    // TODO: consider additional assertions (ie. "calledWith")
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
      await recordReducerActionsDispatch.uploadRecord(
        makeExampleRecord("Sample"),
        [makeExamplePhoto()]
      );
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("uploading action fails", async () => {
      const record = makeExampleRecord("Sample");
      jest.spyOn(RecordManager, "uploadRecord").mockRejectedValueOnce(record);
      await recordReducerActionsDispatch.uploadRecord(record, [
        makeExamplePhoto(),
      ]);
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("downloading action", async () => {
      jest.spyOn(Network, "downloadRecords").mockResolvedValueOnce([]);
      await recordReducerActionsDispatch.downloadRecords();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });

    test("retryPendingRecords action", async () => {
      await recordReducerActionsDispatch.retryPendingRecords();
      expect(recordReducerActionsDispatch.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe("reducer tests", () => {
    test("start seeding", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_SEEDING",
        payload: [],
      });
      expect(state.seeding).toBe(true);
    });

    test("end seeding", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_SEEDING",
        payload: [],
      });
      expect(state.seeding).toBe(false);
      expect(state.seeded).toBe(true);
    });

    test("start saving", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_SAVING",
        payload: [],
      });
      expect(state.saving).toBe(true);
    });

    test("end saving", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_SAVING",
        payload: [],
      });
      expect(state.saving).toBe(false);
    });

    test("start deleting", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_DELETING",
        payload: [],
      });
      expect(state.deleting).toBe(true);
    });

    test("end deleting", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DELETING",
        payload: [],
      });
      expect(state.deleting).toBe(false);
    });

    test("start uploading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_UPLOAD_RECORD",
        payload: [],
      });
      expect(state.uploading).toBe(true);
    });

    test("end uploading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_UPLOAD_RECORD",
        payload: [],
      });
      expect(state.uploading).toBe(false);
    });

    test("start downloading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_DOWNLOADING",
        payload: [],
      });
      expect(state.downloading).toBe(true);
    });

    test("end downloading", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_DOWNLOADING",
        payload: [],
      });
      expect(state.downloading).toBe(false);
    });

    test("start retry pending records", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "START_RETRY",
        payload: [],
      });
      expect(state.uploading).toBe(true);
    });

    test("end retry pending records", () => {
      const state = reducer(makeRecordReducerStateMock(), {
        type: "END_RETRY",
        payload: [],
      });
      expect(state.uploading).toBe(false);
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
