import Logger from "@livingsnow/logger";
import { AlgaeRecordV3, jsonToRecord } from "@livingsnow/record";

import { AlgaeRecordResponseV3 } from "./types";

function dumpRecord(record: AlgaeRecordV3): void {
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
        "",
      )}` +
      `\n  IsOnGlacier: ${record.isOnGlacier}` +
      `\n  SeeExposedIceOrWhatIsUnderSnowpack: ${record.seeExposedIceOrWhatIsUnderSnowpack}` +
      `\n  SnowpackDepth: ${record.snowpackDepth}` +
      `\n  BloomDepth: ${record.bloomDepth}` +
      `\n  Impurities: ${record.impurities?.reduce<string>(
        (prev, cur) => `${prev} ${cur}`,
        "",
      )}` +
      `\n  Description: ${record.locationDescription}` +
      `\n  Notes: ${record.notes}` +
      `\n JSON Body:\n${JSON.stringify(record)}`,
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
const removeEmptyFields = (record: AlgaeRecordV3): AlgaeRecordV3 => {
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

  if (newRecord?.isOnGlacier === undefined) {
    delete newRecord.isOnGlacier;
  }

  if (
    newRecord?.seeExposedIceOrWhatIsUnderSnowpack ===
    "Select what is under snowpack"
  ) {
    delete newRecord.seeExposedIceOrWhatIsUnderSnowpack;
  }

  if (newRecord?.bloomDepth === "Select bloom depth") {
    delete newRecord.bloomDepth;
  }

  if (newRecord?.snowpackDepth === "Select snowpack depth") {
    delete newRecord.snowpackDepth;
  }

  if (newRecord?.impurities?.length === 0) {
    delete newRecord.impurities;
  }

  return newRecord;
};

const recordsApiV3 = () => {
  const baseUrl = `https://snowalgaeproductionapp.azurewebsites.net/api/v3/records`;
  const getUrl = (page?: string) =>
    page
      ? `${baseUrl}?limit=20&pagination_token=${page}`
      : `${baseUrl}?limit=20`;
  const postUrl = baseUrl;
  // v3/photos take a Request-Id header (to prevent duplicate photo uploads on bad cell reception)
  const postPhotoUrl = (recordId: string) =>
    `https://snowalgaeproductionapp.azurewebsites.net/api/v3/records/${recordId}/photo`;
  // continue using v2/micrographs because micrographs will always be uploaded by the lab on a solid connection
  const postMicrographUrl = (recordId: string, filename: string) =>
    `https://snowalgaeproductionapp.azurewebsites.net/api/v2/records/${recordId}/micrograph?filename=${filename}`;

  return {
    baseUrl,
    getUrl,
    postUrl,
    postPhotoUrl,

    // rejects with an error string or the response object
    post: async (
      record: AlgaeRecordV3,
      requestId: string, // prevents duplicate uploads on bad cell reception (response may be dropped)
    ): Promise<AlgaeRecordV3> => {
      const operation = "post";
      dumpRecord(record);
      record = removeEmptyFields(record);
      dumpRecord(record);

      return fetch(postUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Request-Id": requestId,
        },
        // server assigns id (fails if non-zero)
        body: JSON.stringify({ ...record, id: 0 }),
      })
        .then((response) =>
          response.ok
            ? response.text().then((text) => jsonToRecord<AlgaeRecordV3>(text))
            : Promise.reject(response),
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    get: async (page?: string): Promise<AlgaeRecordResponseV3> => {
      const operation = "get";

      Logger.Info(`Handling GET Request: ${getUrl(page)}`);

      return fetch(getUrl(page))
        .then((response) =>
          response.ok
            ? response
                .text()
                .then((text) => jsonToRecord<AlgaeRecordResponseV3>(text))
            : Promise.reject(response),
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    getAll: async (): Promise<AlgaeRecordResponseV3> => {
      const operation = "getAll";

      Logger.Info(`Handling GET All Records Request: ${baseUrl}`);

      return fetch(baseUrl)
        .then((response) =>
          response.ok
            ? response
                .text()
                .then((text) => jsonToRecord<AlgaeRecordResponseV3>(text))
            : Promise.reject(response),
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    postPhoto: async (
      recordId: string,
      photoUri: string,
      requestId: string, // prevents duplicate uploads on bad cell reception (response may be dropped)
    ): Promise<void> => {
      const operation = "postPhoto";

      const uri = { uri: photoUri };

      return fetch(postPhotoUrl(recordId), {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
          "Request-Id": requestId,
        },
        body: uri as any,
      })
        .then((response) =>
          response.ok ? Promise.resolve() : Promise.reject(response),
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },

    // rejects with an error string or the response object
    // micrographFile is the result of selecting the file from <input>
    postMicrograph: async (
      recordId: string,
      micrographFile: File,
    ): Promise<void> => {
      const operation = "postMicrograph";

      const buffer = await micrographFile.arrayBuffer();

      return fetch(postMicrographUrl(recordId, micrographFile.name), {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: buffer,
      })
        .then((response) =>
          response.ok ? Promise.resolve() : Promise.reject(response),
        )
        .catch((error) => Promise.reject(failedFetch(operation, error)));
    },
  };
};

const RecordsApiV3 = recordsApiV3();

export { RecordsApiV3 };
