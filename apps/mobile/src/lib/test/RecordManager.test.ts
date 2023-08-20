import "isomorphic-fetch";
import {
  AlgaeRecord,
  makeExamplePhoto,
  makeExampleRecord,
} from "@livingsnow/record";
import { server } from "@livingsnow/network/mock/server";
import { SelectedPhoto } from "../../../types";
import * as Storage from "../Storage";
import { RecordManager } from "../RecordManager";
import { PhotoManager, UploadError } from "../PhotoManager";
import { Notifications } from "../../constants/Strings";

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(async () => {
  server.reset();
  await Storage.clearPendingRecords();
  await Storage.clearPendingPhotos();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

// BUGBUG: all the tests that create 2 records with photos aren't correct because they share same record id

describe("RecordManager test suite", () => {
  const examplePhoto = [makeExamplePhoto({ isLocal: true })];

  test("upload succeeds", () => {
    const expected = makeExampleRecord("Sample");

    return RecordManager.upload(expected).then((received) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("upload with photos succeeds", () => {
    const expected = makeExampleRecord("Sample");
    PhotoManager.addSelected(expected.id, examplePhoto as SelectedPhoto[]);

    return RecordManager.upload(expected).then((received) => {
      expect(received.id).not.toEqual(expected.id);
      expect(received.type).toEqual(expected.type);
    });
  });

  test("upload fails, record is saved", () => {
    server.postRecordInternalServerError();

    const expected = makeExampleRecord("Sample");

    return RecordManager.upload(expected)
      .then(() => {
        throw new Error("upload was expected to fail");
      })
      .catch(() =>
        Storage.loadPendingRecords().then((received) => {
          expect(received[0]).toEqual(expected);
          expect(received[0].type).toEqual(expected.type);
        })
      );
  });

  test("upload with photos, uploading record succeeds but uploading photos fails, photos are saved", () => {
    const expectedRecord = makeExampleRecord("Sample");
    const expectedPhoto = examplePhoto;
    PhotoManager.addSelected(
      expectedRecord.id,
      examplePhoto as SelectedPhoto[]
    );

    server.postPhotoInternalServerError();

    return RecordManager.upload(expectedRecord)
      .then(() => {
        throw new Error("upload was expected to fail");
      })
      .catch((error: UploadError) => {
        expect(error.errorInfo).toEqual({
          id: error.errorInfo.id,
          title: Notifications.uploadPhotoFailed.title,
          message: Notifications.uploadPhotoFailed.message,
        });

        return Storage.loadPendingPhotos().then((receivedPhotos) => {
          const pendingPhotos = receivedPhotos.get(error.errorInfo.id);

          if (!pendingPhotos) {
            throw new Error("Pending Photos were not saved");
          }

          expect(pendingPhotos[0].uri).toEqual(expectedPhoto[0].uri);
        });
      });
  });

  test("upload with photos, first photo uploads, remaining photos fails, photos are saved", () => {
    const expectedRecord = makeExampleRecord("Sample");
    const expectedPhotos = [examplePhoto[0], examplePhoto[0], examplePhoto[0]];
    PhotoManager.addSelected(
      expectedRecord.id,
      expectedPhotos as SelectedPhoto[]
    );

    server.postPhotoSuccessThenFailure();

    return RecordManager.upload(expectedRecord)
      .then(() => {
        throw new Error("upload was expected to fail");
      })
      .catch((error: UploadError) => {
        expect(error.errorInfo).toEqual({
          id: error.errorInfo.id,
          title: Notifications.uploadPhotosFailed.title,
          message: Notifications.uploadPhotosFailed.message,
        });
      });
  });

  test("multiple uploads succeed", async () => {
    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    const receivedOne = await RecordManager.upload(expectedOne);
    const receivedTwo = await RecordManager.upload(expectedTwo);

    expect(receivedOne).toEqual({ ...expectedOne, id: "1" });
    expect(receivedTwo).toEqual({ ...expectedTwo, id: "2" });

    return Storage.loadPendingRecords().then((received: AlgaeRecord[]) => {
      expect(received.length).toEqual(0);
    });
  });

  test("multiple uploads succeed with photos", async () => {
    const expectedOne = makeExampleRecord("Sample");
    PhotoManager.addSelected(expectedOne.id, examplePhoto as SelectedPhoto[]);

    const expectedTwo = makeExampleRecord("Sighting");
    PhotoManager.addSelected(expectedTwo.id, examplePhoto as SelectedPhoto[]);

    const receivedOne = await RecordManager.upload(expectedOne);
    const receivedTwo = await RecordManager.upload(expectedTwo);

    expect(receivedOne).toEqual({ ...expectedOne, id: "1" });
    expect(receivedTwo).toEqual({ ...expectedTwo, id: "2" });

    return Storage.loadPendingRecords().then((received) => {
      expect(received.length).toEqual(0);

      return Storage.loadPendingPhotos().then((receivedPhotos) => {
        expect(receivedPhotos.size).toEqual(0);
      });
    });
  });

  test("multiple uploads fail, retryPending does not delete saved records", async () => {
    server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    const expectedTwo = makeExampleRecord("Sighting");

    try {
      await RecordManager.upload(expectedOne);
    } catch (error) {
      expect(error.errorInfo).toEqual({
        id: error.errorInfo.id,
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      });
    }

    try {
      await RecordManager.upload(expectedTwo);
    } catch (error) {
      expect(error.errorInfo).toEqual({
        id: error.errorInfo.id,
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      });
    }

    return RecordManager.retryPending().then((received) => {
      expect(received[0]).toEqual({ record: { ...expectedOne } });
      expect(received[1]).toEqual({ record: { ...expectedTwo } });
    });
  });

  test("multiple uploads with photos fail, retryPending does not delete saved records with photos", async () => {
    server.postRecordInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    PhotoManager.addSelected(expectedOne.id, examplePhoto as SelectedPhoto[]);

    // BUG: same record id
    const expectedTwo = makeExampleRecord("Sighting");
    PhotoManager.addSelected(expectedTwo.id, examplePhoto as SelectedPhoto[]);

    try {
      await RecordManager.upload(expectedOne);
    } catch (error) {
      expect(error.errorInfo).toEqual({
        id: error.errorInfo.id,
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      });
    }

    try {
      await RecordManager.upload(expectedTwo);
    } catch (error) {
      expect(error.errorInfo).toEqual({
        id: error.errorInfo.id,
        title: Notifications.uploadRecordFailed.title,
        message: Notifications.uploadRecordFailed.message,
      });
    }

    return RecordManager.retryPending().then((received) => {
      expect(received.length).toEqual(2);
      expect(received[0]).toEqual({
        record: { ...expectedOne },
        photos: examplePhoto,
      });
      expect(received[1]).toEqual({
        record: { ...expectedTwo },
        photos: examplePhoto,
      });
    });
  });

  test("multiple uploads succeed, uploadPhotos fails, retryPending does not delete saved photos", async () => {
    server.postPhotoInternalServerError();

    const expectedOne = makeExampleRecord("Sample");
    await PhotoManager.addSelected(
      expectedOne.id,
      examplePhoto as SelectedPhoto[]
    );

    const expectedTwo = makeExampleRecord("Sighting");
    expectedTwo.id = "12";
    await PhotoManager.addSelected(
      expectedTwo.id,
      examplePhoto as SelectedPhoto[]
    );

    try {
      await RecordManager.upload(expectedOne);
      throw new Error("upload first record was expected to fail");
    } catch (error) {
      expect(error.errorInfo).toEqual({
        id: error.errorInfo.id,
        title: Notifications.uploadPhotoFailed.title,
        message: Notifications.uploadPhotoFailed.message,
      });
    }

    return RecordManager.upload(expectedTwo)
      .then(() => {
        throw new Error("upload second record was expected to fail");
      })
      .catch(async (error) => {
        expect(error.errorInfo).toEqual({
          id: error.errorInfo.id,
          title: Notifications.uploadPhotoFailed.title,
          message: Notifications.uploadPhotoFailed.message,
        });

        await RecordManager.retryPending();

        return Storage.loadPendingPhotos().then((pendingPhotos) => {
          expect(pendingPhotos.size).toEqual(2);

          pendingPhotos.forEach((photos) => {
            expect(photos.length).toEqual(1);
          });
        });
      });
  });
});
