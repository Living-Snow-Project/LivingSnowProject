import {
  AlgaeRecord,
  jsonToRecord,
  PendingPhoto,
  recordDateFormat,
} from "@livingsnow/record";
import Logger from "./Logger";

const serviceEndpoint = "https://snowalgaeproductionapp.azurewebsites.net";
const photosBlobStorageEndpoint =
  "https://snowalgaestorage.blob.core.windows.net/photos";

const recordsUri: string = `${serviceEndpoint}/api/records`;
const recordsUriGet = (before: Date | undefined): string =>
  before === undefined
    ? `${recordsUri}?limit=20`
    : `${recordsUri}?limit=20&before=${recordDateFormat(before)}`;
const uploadPhotoUri = (recordId: number): string =>
  `${recordsUri}/${recordId}/photo`;
const downloadPhotoUri = (uri: string): string =>
  `${photosBlobStorageEndpoint}/${uri}.jpg`;

function dumpRecord(record: AlgaeRecord): void {
  Logger.Info(
    `Handling POST Request: ${serviceEndpoint}/api/records` +
      `\n  Type: ${record.type}` +
      `\n  Name: ${record.name}` +
      `\n  Date: ${record.date}` +
      `\n  Org: ${record.organization}` +
      `\n  TubeId: ${record.tubeId}` +
      `\n  Latitude: ${record.latitude}` +
      `\n  Longitude: ${record.longitude}` +
      `\n  Size: ${record.size}` +
      `\n  Color: ${record.color}` +
      `\n  Description: ${record.locationDescription}` +
      `\n  Notes: ${record.notes}` +
      `\n JSON Body:\n${JSON.stringify(record)}`
  );
}

// could be called after a failed service API call or after a failed network request
function failedFetch(operation: string, response: Response): string {
  const messagePrefix: string = `${operation} failed:`;
  let error: string = `${messagePrefix} ${response}`;

  if (response?.status) {
    error = `${messagePrefix} ${response.status}: ${response.statusText}`;
  }

  Logger.Error(`${error}`);
  return error;
}

// rejects with an error string or the response object
async function uploadRecord(record: AlgaeRecord): Promise<AlgaeRecord> {
  const operation = `uploadRecord`;
  dumpRecord(record);

  return fetch(recordsUri, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // server assigns id (fails if non-zero)
    body: JSON.stringify({ ...record, id: 0 }),
  })
    .then((response) =>
      response.ok
        ? response.text().then((text) => jsonToRecord<AlgaeRecord>(text))
        : Promise.reject(response)
    )
    .catch((error) => Promise.reject(failedFetch(operation, error)));
}

// rejects with an error string or the response object
async function uploadPhoto(photo: PendingPhoto): Promise<void> {
  const operation = `uploadPhoto`;

  const uri = { uri: photo.uri };

  return fetch(uploadPhotoUri(photo.id), {
    method: "POST",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: uri as any,
  })
    .then((response) =>
      response.ok ? Promise.resolve() : Promise.reject(response)
    )
    .catch((error) => Promise.reject(failedFetch(operation, error)));
}

// rejects with an error string or the response object
async function downloadRecords(
  before: Date | undefined = undefined
): Promise<AlgaeRecord[]> {
  const operation = `downloadRecords`;

  Logger.Info(`Handling GET Request: ${recordsUri}`);

  return fetch(recordsUriGet(before))
    .then((response) =>
      response.ok
        ? response.text().then((text) => jsonToRecord<AlgaeRecord[]>(text))
        : Promise.reject(response)
    )
    .catch((error) => Promise.reject(failedFetch(operation, error)));
}

export {
  downloadRecords,
  downloadPhotoUri,
  photosBlobStorageEndpoint,
  recordsUri,
  recordsUriGet,
  serviceEndpoint,
  uploadRecord,
  uploadPhoto,
  uploadPhotoUri,
};
