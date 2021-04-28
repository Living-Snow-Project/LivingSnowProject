import { serviceEndpoint } from '../constants/Service';
import { Storage } from './Storage';

const recordsUri = `${serviceEndpoint}/api/records/`;
const photosUri = id => `${recordsUri}${id}/photo`;

function uploadRecordData(record) {
  return fetch(recordsUri, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record)
  });
}

function uploadPhoto({id, photoStream}) {
  return fetch(photosUri(id), {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: photoStream
  });
}

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

export class Network {
  static uploadRecord(record, photoUris) {
    dumpRecord(record);
    return uploadRecordData(record).then(response => {
      if (response.ok) {
        response.json().then(response => {
          console.log(`upload photos`);
          let photos = [];

          // response contains record id photo associated with
          for (let photo of photoUris) {
            photos.push({id: response.id, photoStream: photo});
          }

          for (let photo of photos) {
            uploadPhoto(photo).then(response => {
              if (!response.ok) {
                Storage.savePhoto(photos);
              }
            })
            .catch((error) => {
              console.log(error);
              Storage.savePhoto(photoUris);
            });
          }
        });

        return Promise.resolve();
      }
      else {
        console.log(`error with upload record request: ${response.status}`);
        record.photoUris = photoUris;
        Storage.saveRecord(record);
        return Promise.reject(`error uploading record`);
      }
    })
    .catch((error) => {
      console.log(error);
      record.photoUris = photoUris;
      Storage.saveRecord(record);
      return Promise.reject(error);
    });
  }
}
