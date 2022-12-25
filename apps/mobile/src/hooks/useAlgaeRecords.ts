import React, { useContext, useMemo, useReducer } from "react";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import Logger from "@livingsnow/logger";
import { downloadRecords } from "@livingsnow/network";
import { AlgaeRecord, PendingPhoto, Photo } from "@livingsnow/record";
import { AlgaeRecordsStates, IAlgaeRecords } from "../../types/AlgaeRecords";
import {
  deletePendingRecord,
  loadCachedRecords,
  loadPendingPhotos,
  loadPendingRecords,
  saveCachedRecords,
  savePendingRecord,
  updatePendingRecord,
} from "../lib/Storage";
import {
  registerBackgroundFetchAsync,
  unregisterBackgroundFetchAsync,
  retryPendingRecords,
  uploadRecord,
} from "../lib/RecordManager";
import { BackgroundTasks } from "../constants/Strings";

type NoPayloadTransitionOnlyStates =
  | "START_DELETING"
  | "START_DOWNLOADING"
  | "START_RETRY"
  | "START_SAVING"
  | "START_SEEDING"
  | "START_UPLOAD_RECORD";

type NoPayloadTransitionOnlyStatesMapping = {
  [key in NoPayloadTransitionOnlyStates]: AlgaeRecordsStates;
};

const statesMapping: NoPayloadTransitionOnlyStatesMapping = {
  START_DELETING: "Deleting",
  START_DOWNLOADING: "Downloading",
  START_RETRY: "Uploading",
  START_SAVING: "Saving",
  START_SEEDING: "Seeding",
  START_UPLOAD_RECORD: "Uploading",
};

type AlgaeRecordsActions =
  | {
      type: NoPayloadTransitionOnlyStates;
    }
  | {
      type: "END_SEEDING";
      payload: {
        pendingRecords: AlgaeRecord[];
        downloadedRecords: AlgaeRecord[];
      };
    }
  | {
      type: "END_SAVING" | "END_DELETING" | "END_RETRY";
      payload: {
        pendingRecords: AlgaeRecord[];
      };
    }
  | {
      type: "END_UPLOAD_RECORD";
      payload: { pendingPhotos: PendingPhoto[]; pendingRecords: AlgaeRecord[] };
    }
  | {
      type: "END_DOWNLOADING";
      payload?: {
        downloadedRecords: AlgaeRecord[];
      };
    }
  | {
      type: "END_DOWNLOADING_NEXT";
      payload: { downloadedRecords: AlgaeRecord[] };
    }
  | {
      type: "END_FULL_SYNC";
      payload: {
        pendingRecords?: AlgaeRecord[];
        downloadedRecords?: AlgaeRecord[];
      };
    };

const defaultState: AlgaeRecordsStates = "Idle";

const algaeRecordsReducer = (
  currentState: AlgaeRecordState,
  action: AlgaeRecordsActions
): AlgaeRecordState => {
  const { type } = action;

  switch (type) {
    case "START_DELETING":
    case "START_DOWNLOADING":
    case "START_RETRY":
    case "START_SAVING":
    case "START_SEEDING":
    case "START_UPLOAD_RECORD":
      return { ...currentState, state: statesMapping[type] };

    case "END_SEEDING":
      return {
        ...currentState,
        isSeeded: true,
        state: defaultState,
        pendingRecords: action.payload.pendingRecords,
        downloadedRecords: action.payload.downloadedRecords,
      };

    case "END_SAVING":
    case "END_DELETING":
    case "END_RETRY":
      return {
        ...currentState,
        state: defaultState,
        pendingRecords: action.payload.pendingRecords,
      };

    case "END_UPLOAD_RECORD":
      return {
        ...currentState,
        state: defaultState,
        // TODO: pendingPhotos: action.payload.pendingPhotos,
        pendingRecords: action.payload.pendingRecords,
      };

    case "END_DOWNLOADING":
      return action.payload
        ? {
            ...currentState,
            state: defaultState,
            downloadedRecords: action.payload.downloadedRecords,
          }
        : {
            ...currentState,
            state: defaultState,
          };

    case "END_DOWNLOADING_NEXT":
      return {
        ...currentState,
        state: defaultState,
        // TODO: smart merge - what if the record is duplicated? this can happen with onEndReached behavior
        downloadedRecords: [
          ...currentState.downloadedRecords,
          ...action.payload.downloadedRecords,
        ],
      };

    case "END_FULL_SYNC":
      if (action.payload.pendingRecords && action.payload.downloadedRecords) {
        return {
          ...currentState,
          state: defaultState,
          downloadedRecords: action.payload.downloadedRecords,
          pendingRecords: action.payload.pendingRecords,
        };
      }

      if (action.payload.pendingRecords) {
        return {
          ...currentState,
          state: defaultState,
          pendingRecords: action.payload.pendingRecords,
        };
      }

      if (action.payload.downloadedRecords) {
        return {
          ...currentState,
          state: defaultState,
          downloadedRecords: action.payload.downloadedRecords,
        };
      }

      return {
        ...currentState,
        state: defaultState,
      };

    default:
      throw new Error("no such action type");
  }
};

type AlgaeRecordState = {
  state: AlgaeRecordsStates;
  isSeeded: boolean;
  pendingRecords: AlgaeRecord[];
  downloadedRecords: AlgaeRecord[];
  // TODO:
  //  pendingPhotos: PendingPhoto[];
};

const initialState: AlgaeRecordState = {
  state: defaultState,
  isSeeded: false,
  pendingRecords: [],
  downloadedRecords: [],
};

function useAlgaeRecords(): [IAlgaeRecords] {
  const [algaeRecordState, dispatch] = useReducer(
    algaeRecordsReducer,
    initialState
  );

  const algaeRecords = useMemo<IAlgaeRecords>(
    () => ({
      getDownloadedRecords: () => algaeRecordState.downloadedRecords,

      getCurrentState: () => algaeRecordState.state,

      getPendingRecords: () => algaeRecordState.pendingRecords,

      isSeeded: () => algaeRecordState.isSeeded,

      seed: async () => {
        dispatch({ type: "START_SEEDING" });
        const cachedRecords = await loadCachedRecords();
        const pendingRecords = await loadPendingRecords();
        dispatch({
          type: "END_SEEDING",
          payload: {
            pendingRecords,
            downloadedRecords: cachedRecords,
          },
        });
      },

      save: async (record: AlgaeRecord) => {
        dispatch({ type: "START_SAVING" });
        const pendingRecords = await savePendingRecord(record);
        dispatch({ type: "END_SAVING", payload: { pendingRecords } });
      },

      delete: async (record: AlgaeRecord) => {
        dispatch({ type: "START_DELETING" });
        const pendingRecords = await deletePendingRecord(record);
        dispatch({ type: "END_DELETING", payload: { pendingRecords } });
      },

      uploadRecord: async (record: AlgaeRecord, photos: Photo[]) => {
        dispatch({ type: "START_UPLOAD_RECORD" });

        try {
          await uploadRecord(record, photos);
          const pendingPhotos = await loadPendingPhotos();
          const pendingRecords = await loadPendingRecords();
          dispatch({
            type: "END_UPLOAD_RECORD",
            payload: { pendingPhotos, pendingRecords },
          });

          return await Promise.resolve();
        } catch (uploadError) {
          const { pendingPhotos, pendingRecords } = uploadError;

          dispatch({
            type: "END_UPLOAD_RECORD",
            payload: { pendingPhotos, pendingRecords },
          });

          registerBackgroundFetchAsync(BackgroundTasks.UploadData, {
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
          });

          return Promise.reject(uploadError);
        }
      },

      downloadRecords: async () => {
        dispatch({ type: "START_DOWNLOADING" });

        try {
          const downloadedRecords = await downloadRecords();
          await saveCachedRecords(downloadedRecords);
          dispatch({
            type: "END_DOWNLOADING",
            payload: { downloadedRecords },
          });
        } catch (error) {
          dispatch({
            type: "END_DOWNLOADING",
          });
        }
      },

      downloadNextRecords: async (before: Date) => {
        dispatch({ type: "START_DOWNLOADING" });

        try {
          const downloadedRecords = await downloadRecords(before);
          // TODO: start downloading photos instead of waiting until the next render
          dispatch({
            type: "END_DOWNLOADING_NEXT",
            payload: { downloadedRecords },
          });
        } catch (error) {
          dispatch({
            type: "END_DOWNLOADING",
          });
        }
      },

      retryPendingRecords: async () => {
        dispatch({ type: "START_RETRY" });
        const pendingRecords = await retryPendingRecords();
        dispatch({ type: "END_RETRY", payload: { pendingRecords } });
      },

      fullSync: async () => {
        /* eslint-disable no-undef-init */
        let pendingRecords: AlgaeRecord[] | undefined = undefined;
        let downloadedRecords: AlgaeRecord[] | undefined = undefined;

        // avoids intermediate "Idle" state between upload and download
        try {
          dispatch({ type: "START_RETRY" });
          pendingRecords = await retryPendingRecords();

          dispatch({ type: "START_DOWNLOADING" });
          downloadedRecords = await downloadRecords();
          await saveCachedRecords(downloadedRecords);

          dispatch({
            type: "END_FULL_SYNC",
            payload: { pendingRecords, downloadedRecords },
          });
        } catch (error) {
          dispatch({
            type: "END_FULL_SYNC",
            payload: { pendingRecords, downloadedRecords },
          });
        }
      },

      updatePendingRecord: async (record: AlgaeRecord) => {
        dispatch({ type: "START_SAVING" });
        const pendingRecords = await updatePendingRecord(record);
        dispatch({ type: "END_SAVING", payload: { pendingRecords } });
      },
    }),
    [algaeRecordState]
  );

  return [algaeRecords];
}

const AlgaeRecordsContext = React.createContext<IAlgaeRecords | null>(null);

const useAlgaeRecordsContext = () => {
  const context = useContext(AlgaeRecordsContext);

  if (!context) {
    throw Error("Algae Records Context not initialized!");
  }

  return context;
};

// Defines tasks which can be executed in the background later
// must return a BackgroundFetchResult; explained here: https://tinyurl.com/5yau6c5y
TaskManager.defineTask(BackgroundTasks.UploadData, async () => {
  Logger.Info("Executing background data upload attempt...");
  await retryPendingRecords();
  const pendingRecords: AlgaeRecord[] = await loadPendingRecords();

  if (pendingRecords.length === 0) {
    unregisterBackgroundFetchAsync(BackgroundTasks.UploadData);
    await downloadRecords();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }

  return BackgroundFetch.BackgroundFetchResult.Failed;
});

// for unit tests
export { algaeRecordsReducer };

// public API
export { useAlgaeRecords, useAlgaeRecordsContext, AlgaeRecordsContext };
