var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Logger from "@livingsnow/logger";
import { jsonToRecord } from "@livingsnow/record";
function dumpRecord(record) {
    var _a;
    Logger.Info(`Handling POST Request:` +
        `\n  Type: ${record.type}` +
        `\n  Name: ${record.name}` +
        `\n  Date: ${record.date}` +
        `\n  Org: ${record.organization}` +
        `\n  TubeId: ${record.tubeId}` +
        `\n  Latitude: ${record.latitude}` +
        `\n  Longitude: ${record.longitude}` +
        `\n  Size: ${record.size}` +
        `\n  Colors: ${record.colors.reduce((prev, cur) => `${prev} ${cur}`, "")}` +
        `\n  IsOnGlacier: ${record.isOnGlacier}` +
        `\n  SeeExposedIceOrWhatIsUnderSnowpack: ${record.seeExposedIceOrWhatIsUnderSnowpack}` +
        `\n  SnowpackDepth: ${record.snowpackDepth}` +
        `\n  BloomDepth: ${record.bloomDepth}` +
        `\n  Impurities: ${(_a = record.impurities) === null || _a === void 0 ? void 0 : _a.reduce((prev, cur) => `${prev} ${cur}`, "")}` +
        `\n  Description: ${record.locationDescription}` +
        `\n  Notes: ${record.notes}` +
        `\n JSON Body:\n${JSON.stringify(record)}`);
}
// could be called after a failed service API call or after a failed network request
function failedFetch(operation, response) {
    const messagePrefix = `${operation} failed:`;
    let error = `${messagePrefix} ${response}`;
    if (response === null || response === void 0 ? void 0 : response.status) {
        error = `${messagePrefix} ${response.status}: ${response.statusText}`;
    }
    Logger.Error(`${error}`);
    return error;
}
// unmodified records do not send these fields
// so if the fields are empty during submission, do not send them
const removeEmptyFields = (record) => {
    var _a;
    const newRecord = Object.assign({}, record);
    if (newRecord.type === "Sighting" || (newRecord === null || newRecord === void 0 ? void 0 : newRecord.tubeId) === "") {
        delete newRecord.tubeId;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.locationDescription) === "") {
        delete newRecord.locationDescription;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.notes) === "") {
        delete newRecord.notes;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.isOnGlacier) === undefined) {
        delete newRecord.isOnGlacier;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.seeExposedIceOrWhatIsUnderSnowpack) ===
        "Select what is under snowpack") {
        delete newRecord.seeExposedIceOrWhatIsUnderSnowpack;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.bloomDepth) === "Select bloom depth") {
        delete newRecord.bloomDepth;
    }
    if ((newRecord === null || newRecord === void 0 ? void 0 : newRecord.snowpackDepth) === "Select snowpack depth") {
        delete newRecord.snowpackDepth;
    }
    if (((_a = newRecord === null || newRecord === void 0 ? void 0 : newRecord.impurities) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        delete newRecord.impurities;
    }
    return newRecord;
};
const recordsApiV3 = () => {
    const baseUrl = `https://snowalgaeproductionapp.azurewebsites.net/api/v3/records`;
    const getUrl = (page) => page
        ? `${baseUrl}?limit=20&pagination_token=${page}`
        : `${baseUrl}?limit=20`;
    const postUrl = baseUrl;
    // v3/photos take a Request-Id header (to prevent duplicate photo uploads on bad cell reception)
    const postPhotoUrl = (recordId) => `https://snowalgaeproductionapp.azurewebsites.net/api/v3/records/${recordId}/photo`;
    // continue using v2/micrographs because micrographs will always be uploaded by the lab on a solid connection
    const postMicrographUrl = (recordId, filename) => `https://snowalgaeproductionapp.azurewebsites.net/api/v2/records/${recordId}/micrograph?filename=${filename}`;
    return {
        baseUrl,
        getUrl,
        postUrl,
        postPhotoUrl,
        // rejects with an error string or the response object
        post: (record, requestId // prevents duplicate uploads on bad cell reception (response may be dropped)
        ) => __awaiter(void 0, void 0, void 0, function* () {
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
                body: JSON.stringify(Object.assign(Object.assign({}, record), { id: 0 })),
            })
                .then((response) => response.ok
                ? response.text().then((text) => jsonToRecord(text))
                : Promise.reject(response))
                .catch((error) => Promise.reject(failedFetch(operation, error)));
        }),
        // rejects with an error string or the response object
        get: (page) => __awaiter(void 0, void 0, void 0, function* () {
            const operation = "get";
            Logger.Info(`Handling GET Request: ${getUrl(page)}`);
            return fetch(getUrl(page))
                .then((response) => response.ok
                ? response
                    .text()
                    .then((text) => jsonToRecord(text))
                : Promise.reject(response))
                .catch((error) => Promise.reject(failedFetch(operation, error)));
        }),
        // rejects with an error string or the response object
        getAll: () => __awaiter(void 0, void 0, void 0, function* () {
            const operation = "getAll";
            Logger.Info(`Handling GET All Records Request: ${baseUrl}`);
            return fetch(baseUrl)
                .then((response) => response.ok
                ? response
                    .text()
                    .then((text) => jsonToRecord(text))
                : Promise.reject(response))
                .catch((error) => Promise.reject(failedFetch(operation, error)));
        }),
        // rejects with an error string or the response object
        postPhoto: (recordId, photoUri, requestId // prevents duplicate uploads on bad cell reception (response may be dropped)
        ) => __awaiter(void 0, void 0, void 0, function* () {
            const operation = "postPhoto";
            const uri = { uri: photoUri };
            return fetch(postPhotoUrl(recordId), {
                method: "POST",
                headers: {
                    "Content-Type": "image/jpeg",
                    "Request-Id": requestId,
                },
                body: uri,
            })
                .then((response) => response.ok ? Promise.resolve() : Promise.reject(response))
                .catch((error) => Promise.reject(failedFetch(operation, error)));
        }),
        // rejects with an error string or the response object
        // micrographFile is the result of selecting the file from <input>
        postMicrograph: (recordId, micrographFile) => __awaiter(void 0, void 0, void 0, function* () {
            const operation = "postMicrograph";
            const buffer = yield micrographFile.arrayBuffer();
            return fetch(postMicrographUrl(recordId, micrographFile.name), {
                method: "POST",
                headers: {
                    "Content-Type": "image/jpeg",
                },
                body: buffer,
            })
                .then((response) => response.ok ? Promise.resolve() : Promise.reject(response))
                .catch((error) => Promise.reject(failedFetch(operation, error)));
        }),
    };
};
const RecordsApiV3 = recordsApiV3();
export { RecordsApiV3 };
