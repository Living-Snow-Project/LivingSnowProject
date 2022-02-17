import "isomorphic-fetch";
import server from "../../mocks/server";
import { clearRecords, clearPhotos, loadRecords, loadPhotos } from "../Storage";
import { Record, makeExampleRecord } from "../../record/Record";
import { uploadRecord } from "../RecordManager";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
  server.reset();
  await clearRecords();
  await clearPhotos();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

describe("RecordManager test suite", () => {
  const examplePhoto = {
    uri: "file:///path/to/file.jpg",
    width: 100,
    height: 160,
  };

  test("uploadRecord succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, []).then((received: Record) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("uploadRecord with photos succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, [examplePhoto]).then((received: Record) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("uploadRecord fails, record is saved", () => {
    server.postRecordInternalServerError();

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

  test("uploadRecord with photos, uploadRecord succeeds and uploadPhotos fails, photos are saved", () => {
    // TODO: annotate
    const expectedRecord = makeExampleRecord("Sample");
    const expectedPhoto = examplePhoto;

    server.postPhotoInternalServerError(server.getNextRecordId());

    return uploadRecord(expectedRecord, [expectedPhoto]).then(
      (receivedRecord: Record) => {
        expect(receivedRecord.id).not.toEqual(expectedRecord.id);
        expect(receivedRecord.type).toEqual(expectedRecord.type);

        return loadPhotos().then((receivedPhotos) => {
          expect(receivedPhotos[0].id).toEqual(receivedRecord.id);
          // @ts-ignore
          expect(receivedPhotos[0].photoStream.uri).toEqual(expectedPhoto.uri);
        });
      }
    );
  });

  test("multiple uploadRecord fails, records are saved", () => {});
  test("multiple uploadRecord fails, records are saved with photos", () => {});
  test("multiple uploadRecord fails, retryRecords does not delete saved records", () => {});
  test("multiple uploadRecord fails, retryRecords does not delete saved records with photos", () => {});
  test("multiple uploadRecord succeeds", () => {});
  test("multiple uploadRecord succeeds with photos", () => {});
  test("retryPhotos succeeds", () => {});
  test("retryPhotos fails and does not delete saved photos", () => {});
});
