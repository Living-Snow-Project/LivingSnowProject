// TODO: feels like this is supposed to be with packages/livingsnow-network
import "isomorphic-fetch";
import {
  downloadRecords,
  uploadRecord,
  uploadPhoto,
  recordsUriGet,
} from "@livingsnow/network";
import server from "../../mocks/server";
import { makeExampleRecord } from "../../record/Record";
import { makeExamplePendingPhoto } from "../../record/Photo";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.reset();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

describe("Network test suite", () => {
  const uploadRecordsFailureMsg = "uploadRecord was expected to fail";
  const downloadRecordsFailureMsg = "downloadRecords was expected to fail";
  const uploadPhotoFailureMsg = "uploadPhoto was expected to fail";
  const examplePhoto = makeExamplePendingPhoto();

  test("upload record succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    const received = await uploadRecord(expected);
    if (typeof received === "object") {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
      expect(received.date).toEqual(expected.date);
    } else {
      fail("uploadRecord was expected to return Record");
    }
  });

  test("upload record fails, service error", () => {
    const internalServerError = server.postRecordInternalServerError();
    const record = makeExampleRecord("Sample");

    return uploadRecord(record)
      .then(() => fail(uploadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("upload record fails, network error", () => {
    const networkError = server.postRecordNetworkError();
    const record = makeExampleRecord("Sample");

    return uploadRecord(record)
      .then(() => fail(uploadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("download records succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    const received = await uploadRecord(expected);

    if (typeof received === "object") {
      // checking all the data fields is not important because server is mocked
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
      expect(received.date).toEqual(expected.date);
    } else {
      fail("uploadRecord did not return Record");
    }

    const downloaded = await downloadRecords();

    expect(downloaded[0]).toEqual(received);
  });

  test("download record fails, service error", () => {
    const internalServerError = server.getRecordsInternalServerError();

    return downloadRecords()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("download record fails, network error", () => {
    const networkError = server.getRecordsNetworkError();

    return downloadRecords()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("upload photo succeeds", async () => {
    await uploadPhoto(examplePhoto);
  });

  test("upload photo fails, service error", () => {
    const internalServerError = server.postPhotoInternalServerError();

    return uploadPhoto(examplePhoto)
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("upload photo fails, network error", () => {
    const networkError = server.postPhotoNetworkError();

    return uploadPhoto(examplePhoto)
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("recordsUriGet with before query parameter", () => {
    expect(recordsUriGet(new Date("2022-3-9"))).toContain("2022-03-09");
  });
});
