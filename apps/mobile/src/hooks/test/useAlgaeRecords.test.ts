import { AlgaeRecordsStates } from "../../../types/AlgaeRecords";
import { algaeRecordsReducer as reducer } from "../useAlgaeRecords";

const defaultState: AlgaeRecordsStates = "Idle";

const currentState = {
  state: defaultState,
  isSeeded: false,
  pendingRecords: [],
  downloadedRecords: [],
  nextPageToken: "",
  // TODO:
  //  pendingPhotos: PendingPhoto[];
};

describe("useRecordReducer test suite", () => {
  describe("reducer tests", () => {
    const payload = {
      pendingPhotos: [],
      pendingRecords: [],
      downloadedRecords: [],
      nextPageToken: "",
    };

    test("start seeding", () => {
      const state = reducer(currentState, {
        type: "START_SEEDING",
      });
      expect(state.state).toBe("Seeding");
    });

    test("end seeding", () => {
      const state = reducer(currentState, {
        type: "END_SEEDING",
        payload,
      });
      expect(state.state).toBe(defaultState);
      expect(state.isSeeded).toBe(true);
    });

    test("start saving", () => {
      const state = reducer(currentState, {
        type: "START_SAVING",
      });
      expect(state.state).toBe("Saving");
    });

    test("end saving", () => {
      const state = reducer(currentState, {
        type: "END_SAVING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start deleting", () => {
      const state = reducer(currentState, {
        type: "START_DELETING",
      });
      expect(state.state).toBe("Deleting");
    });

    test("end deleting", () => {
      const state = reducer(currentState, {
        type: "END_DELETING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start uploading", () => {
      const state = reducer(currentState, {
        type: "START_UPLOAD_RECORD",
      });
      expect(state.state).toBe("Uploading");
    });

    test("end uploading", () => {
      const state = reducer(currentState, {
        type: "END_UPLOAD_RECORD",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start downloading", () => {
      const state = reducer(currentState, {
        type: "START_DOWNLOADING",
      });
      expect(state.state).toBe("Downloading");
    });

    test("end downloading", () => {
      const state = reducer(currentState, {
        type: "END_DOWNLOADING",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("end downloading failed", () => {
      const state = reducer(currentState, {
        type: "END_DOWNLOADING",
      });
      expect(state.state).toBe(defaultState);
    });

    test("end downloading next", () => {
      const state = reducer(currentState, {
        type: "END_DOWNLOADING_NEXT",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("start retry pending records", () => {
      const state = reducer(currentState, {
        type: "START_RETRY",
      });
      expect(state.state).toBe("Uploading");
    });

    test("end retry pending records", () => {
      const state = reducer(currentState, {
        type: "END_RETRY",
        payload,
      });
      expect(state.state).toBe(defaultState);
    });

    test("unknown action", () => {
      let didThrow = false;

      try {
        reducer(currentState, {
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
