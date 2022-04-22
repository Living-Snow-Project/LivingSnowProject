import React, { useReducer } from "react";
import {
  deletePendingRecord,
  loadCachedRecords,
  loadPendingPhotos,
  loadPendingRecords,
  saveCachedRecords,
  savePendingRecord,
  updatePendingRecord,
} from "../lib/Storage";
import { retryPendingRecords, uploadRecord } from "../lib/RecordManager";
import { downloadRecords } from "../lib/Network";

type RecordReducerActionType =
  | "START_SEEDING"
  | "END_SEEDING"
  | "START_SAVING"
  | "END_SAVING"
  | "START_DELETING"
  | "END_DELETING"
  | "START_UPLOAD_RECORD"
  | "END_UPLOAD_RECORD"
  | "START_DOWNLOADING"
  | "END_DOWNLOADING"
  | "END_DOWNLOADING_NEXT"
  | "START_RETRY"
  | "END_RETRY";

type RecordReducerPayload = {
  pendingPhotos: PendingPhoto[];
  pendingRecords: AlgaeRecord[];
  downloadedRecords: AlgaeRecord[];
};

type RecordReducerAction = {
  type: RecordReducerActionType;
  payload: RecordReducerPayload;
};

const defaultState: RecordRecuderStates = "Idle";

const reducer = (
  currentState: RecordReducerState,
  action: RecordReducerAction
): RecordReducerState => {
  const { type, payload } = action;

  switch (type) {
    case "START_SEEDING":
      return { ...currentState, state: "Seeding" };

    case "END_SEEDING":
      return {
        ...currentState,
        seeded: true,
        state: defaultState,
        pendingRecords: payload.pendingRecords,
        downloadedRecords: payload.downloadedRecords,
      };

    case "START_SAVING":
      return { ...currentState, state: "Saving" };

    case "END_SAVING":
      return {
        ...currentState,
        state: defaultState,
        pendingRecords: payload.pendingRecords,
      };

    case "START_DELETING":
      return { ...currentState, state: "Deleting" };

    case "END_DELETING":
      return {
        ...currentState,
        state: defaultState,
        pendingRecords: payload.pendingRecords,
      };

    case "START_UPLOAD_RECORD":
      return { ...currentState, state: "Uploading" };

    case "END_UPLOAD_RECORD":
      return {
        ...currentState,
        state: defaultState,
        pendingRecords: payload.pendingRecords,
      };

    case "START_DOWNLOADING":
      return { ...currentState, state: "Downloading" };

    case "END_DOWNLOADING":
      return payload?.downloadedRecords
        ? {
            ...currentState,
            state: defaultState,
            downloadedRecords: payload.downloadedRecords,
          }
        : {
            ...currentState,
            state: defaultState,
          };

    case "END_DOWNLOADING_NEXT":
      return {
        ...currentState,
        state: defaultState,
        downloadedRecords: [
          ...currentState.downloadedRecords,
          ...payload.downloadedRecords,
        ],
      };

    case "START_RETRY":
      return { ...currentState, state: "Uploading" };

    case "END_RETRY":
      return {
        ...currentState,
        state: defaultState,
        pendingRecords: payload.pendingRecords,
      };

    default:
      throw new Error("no such action type");
  }
};

// !-- keep this in sync with RecordReducerPayload --!
type RecordDispatchPayload = {
  pendingPhotos?: PendingPhoto[];
  pendingRecords?: AlgaeRecord[];
  downloadedRecords?: AlgaeRecord[];
};

type RecordDispatchProps = {
  type: RecordReducerActionType;
  payload?: RecordDispatchPayload;
};

// hide dispatch from public interface
interface RecordReducerActionsDispatch extends RecordReducerActions {
  dispatch: ({ type, payload }: RecordDispatchProps) => void;
}

const recordReducerActionsDispatch: RecordReducerActionsDispatch = {
  dispatch: () => {},

  seed: async function Seed(this: RecordReducerActionsDispatch): Promise<void> {
    this.dispatch({ type: "START_SEEDING" });
    const cachedRecords = await loadCachedRecords();
    const pendingRecords = await loadPendingRecords();
    this.dispatch({
      type: "END_SEEDING",
      payload: {
        pendingRecords,
        downloadedRecords: cachedRecords,
      },
    });
  },

  save: async function Save(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord
  ): Promise<void> {
    this.dispatch({ type: "START_SAVING" });
    const pendingRecords = await savePendingRecord(record);
    this.dispatch({ type: "END_SAVING", payload: { pendingRecords } });
  },

  delete: async function Delete(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord
  ): Promise<void> {
    this.dispatch({ type: "START_DELETING" });
    const pendingRecords = await deletePendingRecord(record);
    this.dispatch({ type: "END_DELETING", payload: { pendingRecords } });
  },

  uploadRecord: async function UploadRecord(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord,
    photos: Photo[]
  ): Promise<void> {
    this.dispatch({ type: "START_UPLOAD_RECORD" });

    try {
      await uploadRecord(record, photos);
      const pendingPhotos = await loadPendingPhotos();
      const pendingRecords = await loadPendingRecords();
      this.dispatch({
        type: "END_UPLOAD_RECORD",
        payload: { pendingPhotos, pendingRecords },
      });

      return await Promise.resolve();
    } catch (uploadError) {
      const { pendingPhotos, pendingRecords } = uploadError;

      this.dispatch({
        type: "END_UPLOAD_RECORD",
        payload: { pendingPhotos, pendingRecords },
      });

      return Promise.reject(uploadError);
    }
  },

  downloadRecords: async function DownloadRecords(
    this: RecordReducerActionsDispatch
  ): Promise<void> {
    this.dispatch({ type: "START_DOWNLOADING" });

    try {
      const downloadedRecords = await downloadRecords();
      await saveCachedRecords(downloadedRecords);
      this.dispatch({
        type: "END_DOWNLOADING",
        payload: { downloadedRecords },
      });
    } catch (error) {
      this.dispatch({
        type: "END_DOWNLOADING",
      });
    }
  },

  downloadNextRecords: async function DownloadNextRecords(
    this: RecordReducerActionsDispatch,
    before: Date
  ): Promise<void> {
    this.dispatch({ type: "START_DOWNLOADING" });

    try {
      const downloadedRecords = await downloadRecords(before);
      this.dispatch({
        type: "END_DOWNLOADING_NEXT",
        payload: { downloadedRecords },
      });
    } catch (error) {
      this.dispatch({
        type: "END_DOWNLOADING",
      });
    }
  },

  retryPendingRecords: async function RetryPendingRecords(
    this: RecordReducerActionsDispatch
  ): Promise<void> {
    this.dispatch({ type: "START_RETRY" });
    const pendingRecords = await retryPendingRecords();
    this.dispatch({ type: "END_RETRY", payload: { pendingRecords } });
  },

  updatePendingRecord: async function UpdatePendingRecord(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord
  ): Promise<void> {
    this.dispatch({ type: "START_SAVING" });
    const pendingRecords = await updatePendingRecord(record);
    this.dispatch({ type: "END_SAVING", payload: { pendingRecords } });
  },
};

const initialState: RecordReducerState = {
  state: defaultState,
  seeded: false,
  pendingRecords: [],
  downloadedRecords: [],
};

function useRecordReducer(): [RecordReducerState, RecordReducerActions] {
  const [state, dispatch] = useReducer(reducer, initialState);

  // actions are asynchronous, call dispatch wrapped in them (like redux-thunk)
  recordReducerActionsDispatch.dispatch = dispatch;

  return [state, recordReducerActionsDispatch];
}

// as per React documentation, there should be different providers for state and dispatch
const RecordReducerStateContext =
  React.createContext<RecordReducerState>(initialState);

const RecordReducerActionsContext = React.createContext<RecordReducerActions>(
  recordReducerActionsDispatch
);

// for unit tests
export { reducer, recordReducerActionsDispatch };

// public API
export {
  useRecordReducer,
  RecordReducerStateContext,
  RecordReducerActionsContext,
};
