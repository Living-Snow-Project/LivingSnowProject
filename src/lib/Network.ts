import Logger from "./Logger";
import serviceEndpoint from "../constants/Service";
import { Record } from "../record/Record";

const recordsUri: string = `${serviceEndpoint}/api/records/`;
const uploadPhotoUri = (id: number): string => `${recordsUri}${id}/photo`;
const downloadPhotoUri = (id: number): string =>
  `${serviceEndpoint}/api/photos/${id}`;

function dumpRecord(record: Record): void {
  Logger.Info(
    `Handling POST Request: ${serviceEndpoint}/api/records` +
      `\n  Type: ${record.type}` +
      `\n  Name: ${record.name}` +
      `\n  Date: ${record.date}` +
      `\n  Org: ${record.organization}` +
      `\n  Atlas Type: ${record.atlasType}` +
      `\n  TubeId: ${record.tubeId}` +
      `\n  Latitude: ${record.latitude}` +
      `\n  Longitude: ${record.longitude}` +
      `\n  Description: ${record.locationDescription}` +
      `\n  Notes: ${record.notes}` +
      `\n JSON Body:\n${JSON.stringify(record)}`
  );
}

function failedFetch(operation: string, response: Response): Promise<void> {
  const messagePrefix = `Failed to ${operation}.`;

  if (response?.status) {
    const error: string = `${messagePrefix} ${response.status}: ${response.statusText}`;
    Logger.Error(error);
    return Promise.reject(error);
  }

  Logger.Error(`${messagePrefix}: ${response}`);
  return Promise.reject(response);
}

async function uploadRecord(record: Record): Promise<Record> {
  const operation = `uploadRecord`;
  dumpRecord(record);

  return fetch(recordsUri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  })
    .then((response) =>
      response.ok ? response.json() : failedFetch(operation, response)
    )
    .catch((error) => failedFetch(operation, error));
}

async function uploadPhoto({ id, photoStream }: Photo): Promise<void> {
  const operation = `uploadPhoto`;

  return fetch(uploadPhotoUri(id), {
    method: "POST",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: photoStream,
  })
    .then((response) =>
      response.ok ? Promise.resolve() : failedFetch(operation, response)
    )
    .catch((error) => failedFetch(operation, error));
}

// TODO: replace any with Record[] when type alignment happens
async function downloadRecords(): Promise<any> {
  const operation = `downloadRecords`;

  Logger.Info(`Handling GET Request: ${recordsUri}`);

  return fetch(recordsUri)
    .then((response) =>
      response.ok ? response.json() : failedFetch(operation, response)
    )
    .catch((error) => failedFetch(operation, error));
}

export { downloadPhotoUri, uploadRecord, uploadPhoto, downloadRecords };
