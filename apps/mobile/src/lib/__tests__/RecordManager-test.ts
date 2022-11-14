import "isomorphic-fetch";
import {
  AlgaeRecord,
  PendingPhoto,
  Photo,
  makeExamplePhoto,
  makeExampleRecord,
} from "@livingsnow/record";
import server from "../../mocks/server";
import {
  clearPendingRecords,
  clearPendingPhotos,
  loadPendingRecords,
  loadPendingPhotos,
} from "../Storage";
import { retryPendingRecords, uploadRecord } from "../RecordManager";
import { Notifications } from "../../constants/Strings";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
  server.reset();
  await clearPendingRecords();
  await clearPendingPhotos();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

describe("RecordManager test suite", () => {
  // TODO: function wrapper
  const examplePhoto = makeExamplePhoto({ isLocal: true });

  test("uploadRecord succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected).then((received: AlgaeRecord) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("uploadRecord with photos succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected, [examplePhoto]).then(
      (received: AlgaeRecord) => {
        expect(received.id).not.toEqual(expected.id);
        expect(received.type).toEqual(expected.type);
      }
    );
  });

  test("uploadRecord fails, record is saved", () => {
    server.postRecordInternalServerError();

    const expected = makeExampleRecord("Sample");

    return uploadRecord(expected)
      .then(() => fail("uploadRecord was expected to succeed"))
      .catch((uploadError) =>
        loadPendingRecords().then((received: AlgaeRecord[]) => {
          expect(received[0]).toEqual(uploadError.pendingRecords[0]);
          expect(received[0].type).toEqual(expected.type);
        })
      );
  });

  test("uploadRecord with photos, uploadRecord succeeds and uploadPhotos fails, photos are saved", () => {
    const expectedRecord = makeExampleRecord("Sample");
    const expectedPhoto = examplePhoto;

    server.postPhotoInternalServerError();

    return uploadRecord(expectedRecord, [expectedPhoto])
      .then(() => {
        fail("uploadRecord was expected to fail");
      })
      .catch((received) => {
        expect(received).toEqual({
          title: Notifications.uploadPhotoFailed.title,
          message: Notifications.uploadPhotoFailed.message,
          pendingRecords: [],
          pendingPhotos: [{ ...examplePhoto, id: 1 }],
        });

        return loadPendingPhotos().then((receivedPhotos) => {
          expect(receivedPhotos[0].uri).toEqual(expectedPhoto.uri);
        });
      });
  });

  test("uploadRecord with photos, first photo uploads, remaining photos fails, photos are saved", () => {
    const expectedRecord = makeExampleRecord("Sample");
    const expectedPhotos = [examplePhoto, examplePhoto, examplePhoto];

    server.postPhotoSuccessThenFailure();

    return uploadRecord(expectedRecord, expectedPhotos)
      .then(() => {
        fail("uploadRecord was expected to fail");
      })
      .catch((received) => {
        const expectedExamplePhoto = { ...examplePhoto, id: 1 };
        expect(received).toEqual({
          title: Notifications.uploadPhotosFailed.title,
          message: Notifications.uploadPhotosFailed.message,
          pendingPhotos: [expectedExamplePhoto, expectedExamplePhoto],
          pendingRecords: [],
        });
      });
  });

  test("multiple uploadRecord succeeds", async () => {
    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    const receivedOne = await uploadRecord(expectedOne);
    const receivedTwo = await uploadRecord(expectedTwo);

    expect(receivedOne).toEqual({ ...expectedOne, id: 1 });
    expect(receivedTwo).toEqual({ ...expectedTwo, id: 2 });

    return loadPendingRecords().then((received: AlgaeRecord[]) => {
      expect(received.length).toEqual(0);
    });
  });

  test("multiple uploadRecord succeeds with photos", async () => {
    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    const receivedOne = await uploadRecord(expectedOne, [examplePhoto]);
    const receivedTwo = await uploadRecord(expectedTwo, [examplePhoto]);

    expect(receivedOne).toEqual({ ...expectedOne, id: 1 });
    expect(receivedTwo).toEqual({ ...expectedTwo, id: 2 });

    return loadPendingRecords().then((received: AlgaeRecord[]) => {
      expect(received.length).toEqual(0);

      return loadPendingPhotos().then((receivedPhotos: Photo[]) => {
        expect(receivedPhotos.length).toEqual(0);
      });
    });
  });

  test("multiple uploadRecord fails, retryPendingRecords does not delete saved records", async () => {
    server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    expectedOne.photos = [];
    const expectedTwo = makeExampleRecord("Sighting");
    expectedTwo.photos = [];

    try {
      await uploadRecord(expectedOne);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
        pendingRecords: [expectedOne],
        pendingPhotos: [],
      });
    }

    try {
      await uploadRecord(expectedTwo);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
        pendingRecords: [expectedOne, expectedTwo],
        pendingPhotos: [],
      });
    }

    return retryPendingRecords().then((received: AlgaeRecord[]) => {
      expect(received[0]).toEqual(expectedOne);
      expect(received[1]).toEqual(expectedTwo);
    });
  });

  test("multiple uploadRecord with photos fails, retryPendingRecords does not delete saved records with photos", async () => {
    server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await uploadRecord(expectedOne, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
        pendingRecords: [{ ...expectedOne, photos: [examplePhoto] }],
        pendingPhotos: [],
      });
    }

    try {
      await uploadRecord(expectedTwo, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
        pendingRecords: [
          { ...expectedOne, photos: [examplePhoto] },
          { ...expectedTwo, photos: [examplePhoto] },
        ],
        pendingPhotos: [],
      });
    }

    return retryPendingRecords().then((received: AlgaeRecord[]) => {
      expect(received.length).toEqual(2);
      expect(received[0]).toEqual({ ...expectedOne, photos: [examplePhoto] });
      expect(received[1]).toEqual({ ...expectedTwo, photos: [examplePhoto] });
    });
  });

  test("multiple uploadRecord succeeds, uploadPhotos fails, retryPendingRecords does not delete saved photos", async () => {
    server.postPhotoInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await uploadRecord(expectedOne, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadPhotoFailed.title,
        message: Notifications.uploadPhotoFailed.message,
        pendingRecords: [],
        pendingPhotos: [{ ...examplePhoto, id: 1 }],
      });
    }

    try {
      await uploadRecord(expectedTwo, [examplePhoto]);
    } catch (receivedError) {
      expect(receivedError).toEqual({
        title: Notifications.uploadPhotoFailed.title,
        message: Notifications.uploadPhotoFailed.message,
        pendingRecords: [],
        pendingPhotos: [
          { ...examplePhoto, id: 1 },
          { ...examplePhoto, id: 2 },
        ],
      });
    }

    await retryPendingRecords();

    return loadPendingPhotos().then((received: PendingPhoto[]) => {
      expect(received[0]).toEqual({ ...examplePhoto, id: 1 });
      expect(received[1]).toEqual({ ...examplePhoto, id: 2 });
    });
  });
});
