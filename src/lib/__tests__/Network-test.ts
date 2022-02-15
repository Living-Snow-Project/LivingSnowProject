import { server, rest, resetServer } from "../../mocks/server";
import "isomorphic-fetch";
import {
  downloadRecords,
  uploadRecord,
  uploadPhoto,
  uploadPhotoUri,
  recordsUri,
} from "../Network";
import { makeExampleRecord } from "../../record/Record";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  resetServer();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

describe("Network test suite", () => {
  const internalServerError = "500: Internal Server Error";
  const networkError = "totally crazy random error";
  const uploadRecordsFailureMsg = "uploadRecord was expected to fail";
  const downloadRecordsFailureMsg = "downloadRecords was expected to fail";
  const uploadPhotoFailureMsg = "uploadPhoto was expected to fail";

  test("upload record succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    // TODO: any!
    const received = await uploadRecord(expected as any);
    if (typeof received === "object") {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
      expect(received.date).toEqual(expected.date);
    } else {
      fail("uploadRecord was expected to return Record");
    }
  });

  test("upload record fails, service error", () => {
    server.use(rest.post(recordsUri, (req, res, ctx) => res(ctx.status(500))));
    const record = makeExampleRecord("Sample");

    return (
      // TODO: any!
      uploadRecord(record as any)
        .then(() => fail(uploadRecordsFailureMsg))
        .catch((error) => expect(error).toContain(internalServerError))
    );
  });

  test("upload record fails, network error", () => {
    server.use(
      rest.post(recordsUri, (req, res) => res.networkError(networkError))
    );
    const record = makeExampleRecord("Sample");

    return (
      // TODO: any!
      uploadRecord(record as any)
        .then(() => fail(uploadRecordsFailureMsg))
        .catch((error) => expect(error).toContain(networkError))
    );
  });

  test("download records succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    // TODO: any!
    const received = await uploadRecord(expected as any);

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
    server.use(rest.get(recordsUri, (req, res, ctx) => res(ctx.status(500))));

    return downloadRecords()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("download record fails, network error", () => {
    server.use(
      rest.get(recordsUri, (req, res) => res.networkError(networkError))
    );

    return downloadRecords()
      .then(() => fail(downloadRecordsFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });

  test("upload photo succeeds", async () => {
    await uploadPhoto({ id: 100, photoStream: "file://stream" });
  });

  test("upload photo fails, service error", () => {
    server.use(
      rest.post(uploadPhotoUri(0), (req, res, ctx) => res(ctx.status(500)))
    );

    return uploadPhoto({ id: 0, photoStream: "" })
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(internalServerError));
  });

  test("upload photo fails, network error", () => {
    server.use(
      rest.post(uploadPhotoUri(0), (req, res) => res.networkError(networkError))
    );

    return uploadPhoto({ id: 0, photoStream: "" })
      .then(() => fail(uploadPhotoFailureMsg))
      .catch((error) => expect(error).toContain(networkError));
  });
});
