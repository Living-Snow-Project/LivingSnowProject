import "isomorphic-fetch";
import { server, rest, resetServer } from "../../mocks/server";
import { recordsUri } from "../Network";
import { clearRecords, clearPhotos, loadRecords } from "../Storage";
import { Record, makeExampleRecord } from "../../record/Record";
import { uploadRecord } from "../RecordManager";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
  server.resetHandlers();
  resetServer();
  await clearRecords();
  await clearPhotos();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

describe("RecordManager test suite", () => {
  test("uploadRecord succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, []).then((received: Record) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("uploadRecord succeeds with photos", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, [
      { uri: "file:///path/to/file.jpg", width: 100, height: 160 },
    ]).then((received: Record) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("uploadRecord fails and record is saved", () => {
    server.use(rest.post(recordsUri, (req, res, ctx) => res(ctx.status(500))));

    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, [])
      .then(() => fail("uploadRecord was expected to succeed"))
      .catch(() =>
        loadRecords().then((received: Record[]) => {
          expect(received[0].id).toEqual(expected.id);
          expect(received[0].type).toEqual(expected.type);
        })
      );
  });

  test("uploadRecord fails and record is saved with photos", () => {});
  test("uploadRecord succeeds but uploadPhoto fails", () => {});
  test("multiple uploadRecord fails, records are saved", () => {});
  test("multiple uploadRecord fails, records are saved with photos", () => {});
  test("multiple uploadRecord fails, retryRecords does not delete saved records", () => {});
  test("multiple uploadRecord fails, retryRecords does not delete saved records with photos", () => {});
  test("multiple uploadRecord succeeds", () => {});
  test("multiple uploadRecord succeeds with photos", () => {});
  test("retryPhotos succeeds", () => {});
  test("retryPhotos fails and does not delete saved photos", () => {});
});
