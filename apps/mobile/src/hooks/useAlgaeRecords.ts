import React, { useContext, useMemo, useReducer } from "react";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import Logger from "@livingsnow/logger";
import {
  RecordsApiV2,
  AlgaeRecordResponseV2,
  DataResponseV2,
} from "@livingsnow/network";
import {
  AlgaeRecordsStates,
  IAlgaeRecords,
  LocalAlgaeRecord,
} from "../../types/AlgaeRecords";
import * as Storage from "../lib/Storage";
import { RecordManager } from "../lib/RecordManager";
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
        pendingRecords: LocalAlgaeRecord[];
        downloadedRecords: DataResponseV2[];
      };
    }
  | {
      type: "END_SAVING" | "END_DELETING" | "END_RETRY";
      payload: {
        pendingRecords: LocalAlgaeRecord[];
      };
    }
  | {
      type: "END_UPLOAD_RECORD";
      payload: {
        pendingRecords: LocalAlgaeRecord[];
      };
    }
  | {
      type: "END_DOWNLOADING";
      payload?: {
        downloadedRecords: DataResponseV2[];
        nextPageToken: string;
      };
    }
  | {
      type: "END_DOWNLOADING_NEXT";
      payload: {
        downloadedRecords: DataResponseV2[];
        nextPageToken: string;
      };
    }
  | {
      type: "END_FULL_SYNC";
      payload: {
        pendingRecords?: LocalAlgaeRecord[];
        downloadedRecords?: DataResponseV2[];
        nextPageToken: string;
      };
    };

const defaultState: AlgaeRecordsStates = "Idle";

const algaeRecordsReducer = (
  currentState: AlgaeRecordState,
  action: AlgaeRecordsActions,
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
        pendingRecords: action.payload.pendingRecords,
      };

    case "END_DOWNLOADING":
      return action.payload
        ? {
            ...currentState,
            state: defaultState,
            downloadedRecords: action.payload.downloadedRecords,
            nextPageToken: action.payload.nextPageToken,
          }
        : {
            ...currentState,
            state: defaultState,
          };

    case "END_DOWNLOADING_NEXT":
      // "smart merge" - what if the record is duplicated?
      // TODO: this is horribly inefficient
      action.payload.downloadedRecords.forEach((item) => {
        if (
          !currentState.downloadedRecords.find(
            (existing) => existing.id == item.id,
          )
        ) {
          currentState.downloadedRecords.push({ ...item });
        }
      });

      return {
        ...currentState,
        state: defaultState,
        downloadedRecords: [...currentState.downloadedRecords],
        nextPageToken: action.payload.nextPageToken,
      };

    case "END_FULL_SYNC":
      if (action.payload.pendingRecords && action.payload.downloadedRecords) {
        return {
          ...currentState,
          state: defaultState,
          downloadedRecords: action.payload.downloadedRecords,
          pendingRecords: action.payload.pendingRecords,
          nextPageToken: action.payload.nextPageToken,
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
          nextPageToken: action.payload.nextPageToken,
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
  pendingRecords: LocalAlgaeRecord[];
  downloadedRecords: DataResponseV2[];
  nextPageToken: string;
};

const initialState: AlgaeRecordState = {
  state: defaultState,
  isSeeded: false,
  pendingRecords: [],
  downloadedRecords: [],
  nextPageToken: "",
};

function useAlgaeRecords(): [IAlgaeRecords] {
  const [algaeRecordState, dispatch] = useReducer(
    algaeRecordsReducer,
    initialState,
  );

  const algaeRecords = useMemo<IAlgaeRecords>(
    () => ({
      getCurrentState: () => algaeRecordState.state,
      getDownloaded: () => algaeRecordState.downloadedRecords,
      getPending: () => algaeRecordState.pendingRecords,
      isSeeded: () => algaeRecordState.isSeeded,

      seed: async () => {
        dispatch({ type: "START_SEEDING" });
        const cachedRecords = await Storage.loadCachedRecords();
        const pendingRecords = await RecordManager.loadPending();
        dispatch({
          type: "END_SEEDING",
          payload: {
            pendingRecords,
            downloadedRecords: cachedRecords,
          },
        });
      },

      delete: async (recordId: string) => {
        dispatch({ type: "START_DELETING" });
        const pendingRecords = await RecordManager.deletePending(recordId);
        dispatch({ type: "END_DELETING", payload: { pendingRecords } });
      },

      download: async () => {
        dispatch({ type: "START_DOWNLOADING" });

        try {
          const downloadedRecords = await RecordsApiV2.get();
          await Storage.saveCachedRecords(downloadedRecords.data);
          dispatch({
            type: "END_DOWNLOADING",
            payload: {
              downloadedRecords: downloadedRecords.data,
              nextPageToken: downloadedRecords.meta.next_token,
            },
          });
        } catch (error) {
          dispatch({
            type: "END_DOWNLOADING",
          });
        }
      },

      downloadNext: async () => {
        dispatch({ type: "START_DOWNLOADING" });

        try {
          const downloadedRecords = await RecordsApiV2.get(
            algaeRecordState.nextPageToken,
          );

          // TODO: start downloading photos instead of waiting until the next render
          dispatch({
            type: "END_DOWNLOADING_NEXT",
            payload: {
              downloadedRecords: downloadedRecords.data,
              nextPageToken: downloadedRecords.meta.next_token,
            },
          });
        } catch (error) {
          dispatch({
            type: "END_DOWNLOADING",
          });
        }
      },

      retryPending: async () => {
        dispatch({ type: "START_RETRY" });
        const pendingRecords = await RecordManager.retryPending();
        dispatch({ type: "END_RETRY", payload: { pendingRecords } });
      },

      fullSync: async () => {
        let pendingRecords: LocalAlgaeRecord[] | undefined;
        let downloadedRecords: AlgaeRecordResponseV2 | undefined;

        // avoids intermediate "Idle" state between upload and download
        try {
          dispatch({ type: "START_RETRY" });
          pendingRecords = await RecordManager.retryPending();

          dispatch({ type: "START_DOWNLOADING" });
          downloadedRecords = await RecordsApiV2.get();
          await Storage.saveCachedRecords(downloadedRecords.data);

          dispatch({
            type: "END_FULL_SYNC",
            payload: {
              pendingRecords,
              downloadedRecords: downloadedRecords.data,
              nextPageToken: downloadedRecords.meta.next_token,
            },
          });
        } catch (error) {
          dispatch({
            type: "END_FULL_SYNC",
            payload: {
              pendingRecords,
              downloadedRecords: downloadedRecords
                ? downloadedRecords.data
                : undefined,
              nextPageToken: downloadedRecords
                ? downloadedRecords.meta.next_token
                : "",
            },
          });
        }
      },
    }),
    [algaeRecordState],
  );

  return [algaeRecords];
}

const AlgaeRecordsContext = React.createContext<IAlgaeRecords | null>(null);

const useAlgaeRecordsContext = (): IAlgaeRecords => {
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
  await RecordManager.retryPending();
  const pendingRecords = await Storage.loadPendingRecords();
  const pendingPhotos = await Storage.loadPendingPhotos();

  if (pendingRecords.length == 0 && pendingPhotos.size == 0) {
    RecordManager.unregisterBackgroundFetchAsync(BackgroundTasks.UploadData);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  }

  return BackgroundFetch.BackgroundFetchResult.Failed;
});

// for unit tests
export { algaeRecordsReducer };

// public API
export { useAlgaeRecords, useAlgaeRecordsContext, AlgaeRecordsContext };
