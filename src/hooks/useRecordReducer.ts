import React, { useReducer } from "react";
import { deleteRecord, loadRecords, saveRecord } from "../lib/Storage";
import { uploadRecord } from "../lib/RecordManager";

type RecordReducerActionType =
  | "START_SEEDING"
  | "END_SEEDING"
  | "START_SAVING"
  | "END_SAVING"
  | "START_DELETING"
  | "END_DELETING"
  | "START_UPLOAD_RECORD"
  | "END_UPLOAD_RECORD";

type RecordReducerAction = {
  type: RecordReducerActionType;
  payload: AlgaeRecord[];
};

const reducer = (
  state: RecordReducerState,
  action: RecordReducerAction
): RecordReducerState => {
  switch (action.type) {
    case "START_SEEDING":
      return { ...state, seeding: true };

    case "END_SEEDING":
      return {
        ...state,
        seeded: true,
        seeding: false,
        pendingRecords: action.payload,
      };

    case "START_SAVING":
      return { ...state, saving: true };

    case "END_SAVING":
      return { ...state, saving: false, pendingRecords: action.payload };

    case "START_DELETING":
      return { ...state, deleting: true };

    case "END_DELETING":
      return { ...state, deleting: false, pendingRecords: action.payload };

    case "START_UPLOAD_RECORD":
      return { ...state, uploading: true };

    case "END_UPLOAD_RECORD":
      return { ...state, uploading: false, pendingRecords: action.payload };

    default:
      throw new Error("no such action type");
  }
};

// hide dispatch from public interface
interface RecordReducerActionsDispatch extends RecordReducerActions {
  dispatch: ({
    type,
    payload,
  }: {
    type: RecordReducerActionType;
    payload?: AlgaeRecord[];
  }) => void;
}

const recordReducerActionsDispatch: RecordReducerActionsDispatch = {
  dispatch: () => {},
  seed: async function Seed(this: RecordReducerActionsDispatch): Promise<void> {
    this.dispatch({ type: "START_SEEDING" });
    const records = await loadRecords();
    this.dispatch({ type: "END_SEEDING", payload: records });
  },

  save: async function Save(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord
  ): Promise<void> {
    this.dispatch({ type: "START_SAVING" });
    await saveRecord(record);
    // TODO: saveRecord should return the new record array
    const records = await loadRecords();
    this.dispatch({ type: "END_SAVING", payload: records });
  },

  delete: async function Delete(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord
  ): Promise<void> {
    this.dispatch({ type: "START_DELETING" });
    const records = await deleteRecord(record);
    this.dispatch({ type: "END_DELETING", payload: records });
  },

  uploadRecord: async function UploadRecord(
    this: RecordReducerActionsDispatch,
    record: AlgaeRecord,
    photos: Photo[]
  ): Promise<void> {
    this.dispatch({ type: "START_UPLOAD_RECORD" });

    try {
      await uploadRecord(record, photos);
      // ? if (this.pendingRecords.length === 0)
      // ? dispatch("END_UPLOAD_RECORD", payload: [])
      // ? TODO: this.downloadRecords()?
    } catch (pendingRecords) {
      // ? TODO: uploadRecord errors with the record\photo(s) if they are not uploaded
      // dispatch("END_UPLOADING_RECORD", payload:pendingRecords)
    }

    // ? TODO: not necessary if uploadRecord success downloads latest and failure returns pendingRecords
    const pendingRecords = await loadRecords();
    this.dispatch({ type: "END_UPLOAD_RECORD", payload: pendingRecords });
  },
};

const initialState: RecordReducerState = {
  saving: false,
  seeded: false,
  seeding: false,
  deleting: false,
  uploading: false,
  pendingRecords: [],
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
