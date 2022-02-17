import "isomorphic-fetch";
import server from "../../mocks/server";
import { clearRecords, clearPhotos, loadRecords, loadPhotos } from "../Storage";
import { Record, makeExampleRecord } from "../../record/Record";
import { retryRecords, uploadRecord } from "../RecordManager";

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

    const expectedError = server.postPhotoInternalServerError();

    return uploadRecord(expectedRecord, [expectedPhoto])
      .then(() => {
        fail("uploadRecord was expected to fail");
      })
      .catch((received) => {
        expect(received).toContain(expectedError);
        expect(received).toContain("uploadPhoto");

        return loadPhotos().then((receivedPhotos) => {
          // @ts-ignore
          expect(receivedPhotos[0].photoStream.uri).toEqual(expectedPhoto.uri);
        });
      });
  });

  test("multiple uploadRecord succeeds", async () => {
    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    await uploadRecord(expectedOne, []);
    await uploadRecord(expectedTwo, []);

    return loadRecords().then((received: Record[]) => {
      expect(received.length).toEqual(0);
    });
  });

  test("multiple uploadRecord succeeds with photos", async () => {
    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    await uploadRecord(expectedOne, [examplePhoto]);
    await uploadRecord(expectedTwo, [examplePhoto]);

    return loadRecords().then((received: Record[]) => {
      expect(received.length).toEqual(0);

      return loadPhotos().then((receivedPhotos: Photo[]) => {
        expect(receivedPhotos.length).toEqual(0);
      });
    });
  });

  test("multiple uploadRecord fails, retryRecords does not delete saved records", async () => {
    const expectedError = server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await uploadRecord(expectedOne, []);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    try {
      await uploadRecord(expectedTwo, []);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    await retryRecords();

    return loadRecords().then((received: Record[]) => {
      expect(received[0].id).toEqual(expectedOne.id);
      expect(received[0].type).toEqual(expectedOne.type);
      expect(received[1].id).toEqual(expectedTwo.id);
      expect(received[1].type).toEqual(expectedTwo.type);
    });
  });

  test("multiple uploadRecord with photos fails, retryRecords does not delete saved records with photos", async () => {
    const expectedError = server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await uploadRecord(expectedOne, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    try {
      await uploadRecord(expectedTwo, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    await retryRecords();

    return loadRecords().then((received: Record[]) => {
      expect(received.length).toEqual(2);
      expect(received[0].photoUris?.length).toEqual(1);
      expect(received[1].photoUris?.length).toEqual(1);
    });
  });

  test("multiple uploadRecord succeeds, uploadPhotos fails, retryRecords does not delete saved photos", async () => {
    const expectedError = server.postPhotoInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await uploadRecord(expectedOne, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    try {
      await uploadRecord(expectedTwo, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toContain(expectedError);
    }

    await retryRecords();

    return loadPhotos().then((received: Photo[]) => {
      expect(received[0].photoStream).toEqual(examplePhoto);
      expect(received[1].photoStream).toEqual(examplePhoto);
    });
  });
});
