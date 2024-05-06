import Logger from "@livingsnow/logger";
import { AlgaeRecord, jsonToRecord } from "@livingsnow/record";

import { AlgaeRecordResponseV2 } from "./types";

function dumpRecord(record: AlgaeRecord): void {
  Logger.Info(
    `Handling POST Request:` +
      `\n  Type: ${record.type}` +
      `\n  Name: ${record.name}` +
      `\n  Date: ${record.date}` +
      `\n  Org: ${record.organization}` +
      `\n  TubeId: ${record.tubeId}` +
      `\n  Latitude: ${record.latitude}` +
      `\n  Longitude: ${record.longitude}` +
      `\n  Size: ${record.size}` +
      `\n  Colors: ${record.colors.reduce<string>(
        (prev, cur) => `${prev} ${cur}`,
        ""
      )}` +
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

// unmodified records do not send these fields
// so if the fields are empty during submission, do not send them
const removeEmptyFields = (record: AlgaeRecord): AlgaeRecord => {
  const newRecord = { ...record };

  if (newRecord.type === "Sighting" || newRecord?.tubeId === "") {
    delete newRecord.tubeId;
  }

  if (newRecord?.locationDescription === "") {
    delete newRecord.locationDescription;
  }

  if (newRecord?.notes === "") {
    delete newRecord.notes;
  }

  return newRecord;
};

const recordsApi = () => {
  const baseUrl = `https://snowalgaeproductionapp.azurewebsites.net/api/v2.0/records`;
  const getUrl = (page?: string) =>
    page
      ? `${baseUrl}?limit=20&pagination_token=${page}`
      : `${baseUrl}?limit=20`;
  const postUrl = baseUrl;
  // TODO: continue with v1 with photos for now, still deciding on what v2 photo endpoint will look like
  const postPhotoUrl = (recordId: string) =>
    `https://snowalgaeproductionapp.azurewebsites.net/api/v1.0/records/${recordId}/photo`;

  return {
    baseUrl,
    getUrl,
    postUrl,
    postPhotoUrl,

    // rejects with an error string or the response object
    post: async (record: AlgaeRecord): Promise<AlgaeRecord> => {
      const operation = "post";
      dumpRecord(record);
      record = removeEmptyFields(record);
      dumpRecord(record);

      return fetch(postUrl, {
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
    },

    // rejects with an error string or the response object
    get: async (page?: string): Promise<AlgaeRecordResponseV2> => {
      const operation = "get";

      Logger.Info(`Handling GET Request: ${getUrl(page)}`);

      return fetch(getUrl(page))
        .then((response) =>
          response.ok
            ? response
                .text()
                .then((text) => jsonToRecord<AlgaeRecordResponseV2>(text))
            : Promise.reject(response)
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    getAll: async (): Promise<AlgaeRecordResponseV2> => {
      const operation = "getAll";

      Logger.Info(`Handling GET All Records Request: ${baseUrl}`);

      return fetch(baseUrl)
        .then((response) =>
          response.ok
            ? response
                .text()
                .then((text) => jsonToRecord<AlgaeRecordResponseV2>(text))
            : Promise.reject(response)
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    postPhoto: async (recordId: string, photoUri: string): Promise<void> => {
      const operation = "postPhoto";

      const uri = { uri: photoUri };

      return fetch(postPhotoUrl(recordId), {
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
    },
  };
};

const RecordsApiV2 = recordsApi();

export { RecordsApiV2 };
