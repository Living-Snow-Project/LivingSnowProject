import "isomorphic-fetch";
import { makeExampleAppPhoto, makeExampleRecord } from "@livingsnow/record";

import { server } from "../mock/server";
import { RecordsApiV2 } from "../src";

beforeAll(() => server.listen());

afterEach(() => {
  server.reset();
});

afterAll(() => server.close());

describe("Network test suite", () => {
  const uploadRecordsFailureMsg = "uploadRecord was expected to fail";
  const downloadRecordsFailureMsg = "downloadRecords was expected to fail";
  const uploadPhotoFailureMsg = "uploadPhoto was expected to fail";
  const examplePhoto = makeExampleAppPhoto();

  test("upload record succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    const received = await RecordsApiV2.post(expected);

    if (typeof received == "object") {
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

    return RecordsApiV2.post(record)
      .then(() => fail(uploadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("upload record fails, network error", () => {
    const networkError = server.postRecordNetworkError();
    const record = makeExampleRecord("Sample");

    return RecordsApiV2.post(record)
      .then(() => fail(uploadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("download records succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    const received = await RecordsApiV2.post(expected);

    if (typeof received == "object") {
      // checking all the data fields is not important because server is mocked
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
      expect(received.date).toEqual(expected.date);
    } else {
      fail("uploadRecord did not return Record");
    }

    const response = await RecordsApiV2.get();

    expect(response.object).toEqual("list");
    expect(response.data[0]).toEqual(received);
    expect(response.meta.result_count).toEqual(response.data.length);
    expect(response.meta.next_token).toEqual("");
  });

  test("download record fails, service error", () => {
    const internalServerError = server.getRecordsInternalServerError();

    return RecordsApiV2.get()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("download record fails, network error", () => {
    const networkError = server.getRecordsNetworkError();

    return RecordsApiV2.get()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("upload photo succeeds", async () => {
    await RecordsApiV2.postPhoto(1, examplePhoto);
  });

  test("upload photo fails, service error", () => {
    const internalServerError = server.postPhotoInternalServerError();

    return RecordsApiV2.postPhoto(1, examplePhoto)
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("upload photo fails, network error", () => {
    const networkError = server.postPhotoNetworkError();

    return RecordsApiV2.postPhoto(1, examplePhoto)
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });
});
