import { serviceEndpoint } from '../constants/Service';

const recordsUri = `${serviceEndpoint}/api/records/`;
const uploadPhotoUri = id => `${recordsUri}${id}/photo`;
export const downloadPhotoUri = id => `${serviceEndpoint}/api/photos/${id}`;

function dumpRecord(record) {
  console.log(`Handling POST Request: ${serviceEndpoint}/api/records` +
  `\n  Type: ${record.Type}` +
  `\n  Name: ${record.Name}` +
  `\n  Date: ${record.Date}` +
  `\n  Org: ${record.Organization}` +
  `\n  TubeId: ${record.TubeId}` +
  `\n  Latitude: ${record.Latitude}` +
  `\n  Longitude: ${record.Longitude}` +
  `\n  Description: ${record.LocationDescription}` +
  `\n  Notes: ${record.Notes}` +
  `\nJSON Body\n  `, record);
}

function failedFetch(operation, response) {
  let messagePrefix = `Failed to ${operation}.`;

  if (response?.status) {
    let error = `${messagePrefix} ${response.status}: ${response.statusText}`;
    console.log(error);
    return Promise.reject(error);
  }

  console.log(messagePrefix, response);
  return Promise.reject(response);
}

export class Network {
  // returns a resolved Promise<record> on success
  static async uploadRecord(record) {
    let operation = `uploadRecord`;
    dumpRecord(record);

    return fetch(recordsUri, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record)
    })
    .then(response => response.ok ? response.json() : failedFetch(operation, response))
    .catch(error => failedFetch(operation, error));
  }
  
  // returns a resolved Promise<void> on success
  static async uploadPhoto({id, photoStream}) {
    let operation = `uploadPhoto`;

    return fetch(uploadPhotoUri(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: photoStream
    })
    .then(response => response.ok ? Promise.resolve() : failedFetch(operation, response))
    .catch(error => failedFetch(operation, error));
  }

  // returns a resolved Promise<records> on success
  static async downloadRecords() {
    let operation = `downloadRecords`;

    console.log(`Handling GET Request: ${recordsUri}`);
    
    return fetch(recordsUri)
    .then(response => response.ok ? response.json() : failedFetch(operation, response))
    .catch(error => failedFetch(operation, error));
  }
}
