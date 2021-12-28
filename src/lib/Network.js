import { serviceEndpoint } from "../constants/Service";

const recordsUri = `${serviceEndpoint}/api/records/`;
const uploadPhotoUri = (id) => `${recordsUri}${id}/photo`;
export const downloadPhotoUri = (id) => `${serviceEndpoint}/api/photos/${id}`;

function dumpRecord(record) {
  console.log(
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
      `\nJSON Body\n  `,
    record
  );
}

function failedFetch(operation, response) {
  const messagePrefix = `Failed to ${operation}.`;

  if (response?.status) {
    const error = `${messagePrefix} ${response.status}: ${response.statusText}`;
    console.log(error);
    return Promise.reject(error);
  }

  console.log(messagePrefix, response);
  return Promise.reject(response);
}

export class Network {
  // returns a resolved Promise<record> on success
  static async uploadRecord(record) {
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

  // photoStream = {uri, width, height}
  // returns a resolved Promise<void> on success
  static async uploadPhoto({ id, photoStream }) {
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

  // returns a resolved Promise<records> on success
  static async downloadRecords() {
    const operation = `downloadRecords`;

    console.log(`Handling GET Request: ${recordsUri}`);

    return fetch(recordsUri)
      .then((response) =>
        response.ok ? response.json() : failedFetch(operation, response)
      )
      .catch((error) => failedFetch(operation, error));
  }
}
