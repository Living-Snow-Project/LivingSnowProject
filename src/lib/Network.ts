import Logger from "./Logger";
import serviceEndpoint from "../constants/Service";
import { jsonToRecord } from "../record/Record";

const recordsUri: string = `${serviceEndpoint}/api/records/`;
const uploadPhotoUri = (id: number): string => `${recordsUri}${id}/photo`;
const downloadPhotoUri = (id: number): string =>
  `${serviceEndpoint}/api/photos/${id}`;

function dumpRecord(record: AlgaeRecord): void {
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

// could be called after a failed service API call or after a failed network request
function failedFetch(operation: string, response: Response): Promise<string> {
  const messagePrefix: string = `${operation} failed:`;
  let error: string = `${messagePrefix} ${response}`;

  if (response?.status) {
    error = `${messagePrefix} ${response.status}: ${response.statusText}`;
  }

  Logger.Error(`${error}`);
  return Promise.reject(error);
}

// TODO: Promise<error string> on failure
// returns Promise<Record> on success, Promise<error string> on failure
// async function uploadRecord(record: AlgaeRecord): Promise<AlgaeRecord | string> {
async function uploadRecord(record: AlgaeRecord): Promise<AlgaeRecord> {
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
      response.ok
        ? response.text().then((text) => jsonToRecord(text) as any)
        : Promise.reject(response)
    )
    .catch((error) => failedFetch(operation, error));
}

// returns Promise<void> on success, Promise<error string> on failure
async function uploadPhoto({ id, photoStream }: Photo): Promise<void | string> {
  const operation = `uploadPhoto`;

  return fetch(uploadPhotoUri(id), {
    method: "POST",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: photoStream,
  })
    .then((response) =>
      response.ok ? Promise.resolve() : Promise.reject(response)
    )
    .catch((error) => failedFetch(operation, error));
}

// TODO: type alignment
// returns Promise<Record[]> on success and Promise<error string> on failure
// async function downloadRecords(): Promise<Record[] | string> {
async function downloadRecords(): Promise<any> {
  const operation = `downloadRecords`;

  Logger.Info(`Handling GET Request: ${recordsUri}`);

  return fetch(recordsUri)
    .then((response) =>
      response.ok
        ? response.text().then((text) => jsonToRecord(text))
        : Promise.reject(response)
    )
    .catch((error) => failedFetch(operation, error));
}

export {
  downloadRecords,
  downloadPhotoUri,
  uploadRecord,
  uploadPhoto,
  uploadPhotoUri,
  recordsUri,
};
