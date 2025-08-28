import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { makeExamplePhoto, makeExampleRecord } from "@livingsnow/record";
import { DataResponseV2 } from "@livingsnow/network";
import { PendingPhoto, PendingPhotos } from "../../../types";
import * as Storage from "../Storage";
import { AppSettings } from "../../../types/AppSettings";
import { Errors } from "../../constants/Strings";

const makeTestAppConfig = (): AppSettings => ({
  name: "Test Name",
  organization: "Test Org",
  showFirstRun: true,
  showGpsWarning: false,
  colorMode: "light",
});

const makePendingPhoto = () => makeExamplePhoto({ isLocal: true });

const mockOneAsyncStorageFailure = (
  method: keyof typeof mockAsyncStorage,
): Error => {
  const error = new Error(`mocked ${method} error`);
  jest.spyOn(mockAsyncStorage, method).mockRejectedValueOnce(error);

  return error;
};

describe("Storage test suite", () => {
  afterEach(() => {
    Storage.clearPendingRecords();
    Storage.clearPendingPhotos();
  });

  describe("AppConfig tests", () => {
    test("loadAppConfig succeeds with empty config", async () => {
      const received = await Storage.loadAppConfig();
      expect(received).toEqual(null);
    });

    test("loadAppConfig fails", async () => {
      const expected: AppSettings = makeTestAppConfig();

      await Storage.saveAppConfig(expected);
      const received = await Storage.loadAppConfig();
      expect(received).toEqual(expected);

      mockOneAsyncStorageFailure("getItem");

      const receivedFailure = await Storage.loadAppConfig();
      expect(receivedFailure).toEqual(null);
    });

    test("saveAppConfig succeeds", async () => {
      const expected: AppSettings = makeTestAppConfig();

      await Storage.saveAppConfig(expected);
      const received = await Storage.loadAppConfig();
      expect(received).toEqual(expected);
    });

    test("saveAppConfig empty input doesn't overwrite existing config", async () => {
      const expected: AppSettings = makeTestAppConfig();

      await Storage.saveAppConfig(expected);
      let received = await Storage.loadAppConfig();
      expect(received).toEqual(expected);

      // @ts-ignore
      await Storage.saveAppConfig(null);
      received = await Storage.loadAppConfig();
      expect(received).toEqual(expected);
    });

    test("saveAppConfig fails", async () => {
      const expected: AppSettings = makeTestAppConfig();
      const expectedError = mockOneAsyncStorageFailure("setItem");

      const received = await Storage.saveAppConfig(expected);
      expect(received).toEqual(expectedError);
    });
  });

  describe("pendingRecords tests", () => {
    test("loadPendingRecords succeeds with no records", async () => {
      const received = await Storage.loadPendingRecords();
      expect(received).toEqual([]);
    });

    test("loadPendingRecords fails", async () => {
      mockOneAsyncStorageFailure("getItem");
      const received = await Storage.loadPendingRecords();
      expect(received).toEqual([]);
    });

    test("savePendingRecords succeeds", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      const received = await Storage.savePendingRecords(expected);
      expect(received).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);
    });

    test("savePendingRecords with empty records doesn't overwrite existing records", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      let received = await Storage.savePendingRecords(expected);
      expect(received).toEqual(expected);

      // @ts-ignore
      received = await Storage.savePendingRecords(null);
      expect(received).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);
    });

    test("savePendingRecords fails", async () => {
      const expected = [makeExampleRecord("Sighting")];
      const expectedError = mockOneAsyncStorageFailure("setItem");

      const received = await Storage.savePendingRecords(expected);
      expect(received).toEqual(expectedError);
    });

    test("deletePendingRecord removes record", async () => {
      const expected = [
        { ...makeExampleRecord("Sample"), id: "1" },
        { ...makeExampleRecord("Sighting"), id: "2" },
        { ...makeExampleRecord("Sample"), id: "3" },
      ];

      await Storage.savePendingRecords(expected);
      const received = await Storage.deletePendingRecord(expected[1].id);
      const newExpected = [expected[0], expected[2]];
      expect(received).toEqual(newExpected);
    });

    test("deletePendingRecord with record that does not exist", async () => {
      const expected = [
        { ...makeExampleRecord("Sample"), id: "1" },
        { ...makeExampleRecord("Sighting"), id: "2" },
        { ...makeExampleRecord("Sample"), id: "3" },
      ];

      await Storage.savePendingRecords(expected);
      const received = await Storage.deletePendingRecord(
        makeExampleRecord("Sample").id,
      );

      expect(received).toEqual(expected);
    });

    test("deleteRecord empty record", async () => {
      const expected = [
        { ...makeExampleRecord("Sample"), id: "1" },
        { ...makeExampleRecord("Sighting"), id: "2" },
        { ...makeExampleRecord("Sample"), id: "3" },
      ];

      await Storage.savePendingRecords(expected);
      // @ts-ignore
      const received = await Storage.deletePendingRecord(null);
      expect(received).toEqual(expected);
    });

    test("clearPendingRecords succeeds", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      await Storage.savePendingRecords(expected);
      let received = await Storage.loadPendingRecords();
      expect(received).toEqual(expected);

      await Storage.clearPendingRecords();
      received = await Storage.loadPendingRecords();
      expect(received).toEqual([]);
    });

    test("clearPendingRecords fails", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      let received = await Storage.savePendingRecords(expected);
      expect(received).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);

      const expectedError = mockOneAsyncStorageFailure("removeItem");
      const receievedError = await Storage.clearPendingRecords();
      expect(receievedError).toEqual(expectedError);

      await Storage.clearPendingRecords();
      received = await Storage.loadPendingRecords();
      expect(received).toEqual([]);
    });

    test("savePendingRecord succeeds", async () => {
      const expected = makeExampleRecord("Sample");

      const received = await Storage.savePendingRecord(expected);
      expect(received[0]).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);
    });

    test("savePendingRecord with empty record doesn't change existing records", async () => {
      const expected = makeExampleRecord("Sample");

      let received = await Storage.savePendingRecord(expected);
      expect(received[0]).toEqual(expected);

      // @ts-ignore
      received = await Storage.savePendingRecord(null);
      expect(received[0]).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);
    });

    test("savePendingRecord fails", async () => {
      const expected = makeExampleRecord("Sighting");
      const expectedError = mockOneAsyncStorageFailure("setItem");

      const received = await Storage.savePendingRecord(expected);
      expect(received).toEqual(expectedError);
    });

    test("updatePendingRecord succeeds", async () => {
      const expected = makeExampleRecord("Sample");

      let received = await Storage.savePendingRecord(expected);
      expect(received[0]).toEqual(expected);

      const pending = await Storage.loadPendingRecords();
      expect(pending).toEqual(received);

      expected.type = "Sighting";
      expected.latitude = 555.5555;
      expected.longitude = -333.6666;
      delete expected.tubeId;
      delete expected.locationDescription;
      delete expected.notes;

      received = await Storage.updatePendingRecord(expected);
      expect(received[0]).toEqual(expected);
    });

    test("updatePendingRecord fails", async () => {
      try {
        await Storage.updatePendingRecord(makeExampleRecord("Sample"));
        fail("updatePendingRecord was expected to fail");
      } catch (error) {
        expect(error).toEqual(Errors.recordNotFound);
      }
    });
  });

  describe("cachedRecords tests", () => {
    test("loadCachedRecords succeeds with no records", async () => {
      const received = await Storage.loadCachedRecords();
      expect(received).toEqual([]);
    });

    test("loadCachedRecords fails", async () => {
      mockOneAsyncStorageFailure("getItem");
      const received = await Storage.loadCachedRecords();
      expect(received).toEqual([]);
    });

    test("saveCachedRecords succeeds", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      const received = await Storage.saveCachedRecords(
        expected as DataResponseV2[],
      );

      expect(received).toEqual(expected);

      const pending = await Storage.loadCachedRecords();
      expect(pending).toEqual(received);
    });

    test("saveCachedRecords with empty records doesn't overwrite existing records", async () => {
      const expected = [
        makeExampleRecord("Sample"),
        makeExampleRecord("Sighting"),
      ];

      let received = await Storage.saveCachedRecords(
        expected as DataResponseV2[],
      );
      expect(received).toEqual(expected);

      // @ts-ignore
      received = await Storage.saveCachedRecords(null);
      expect(received).toEqual(expected);

      const pending = await Storage.loadCachedRecords();
      expect(pending).toEqual(received);
    });

    test("saveCachedRecords fails", async () => {
      const expected = [makeExampleRecord("Sighting")];
      const expectedError = mockOneAsyncStorageFailure("setItem");

      const received = await Storage.saveCachedRecords(
        expected as DataResponseV2[],
      );
      expect(received).toEqual(expectedError);
    });
  });

  describe("pending photos tests", () => {
    test("load succeeds with no photos", async () => {
      const received = await Storage.loadPendingPhotos();
      expect(received).toEqual(new Map());
    });

    test("load fails", async () => {
      const expectedError = mockOneAsyncStorageFailure("getItem");

      try {
        await Storage.loadPendingPhotos();
        throw new Error("loadPendingPhotos was expected to reject");
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    test("save succeeds", async () => {
      const expected: PendingPhotos = new Map<string, PendingPhoto[]>();
      expected.set("1", [makePendingPhoto()]);

      const saved = await Storage.savePendingPhotos(expected);
      expect(saved).toEqual(expected);

      const loaded = await Storage.loadPendingPhotos();
      expect(loaded).toEqual(expected);
    });

    test("save with empty photos doesn't overwrite existing photos", async () => {
      const expected: PendingPhotos = new Map<string, PendingPhoto[]>();
      expected.set("1", [makePendingPhoto()]);

      let saved = await Storage.savePendingPhotos(expected);
      expect(saved).toEqual(expected);

      // @ts-ignore
      saved = await Storage.savePendingPhotos(undefined);
      expect(saved).toEqual(expected);

      const loaded = await Storage.loadPendingPhotos();
      expect(loaded).toEqual(expected);
    });

    test("save fails", async () => {
      const expected: PendingPhotos = new Map<string, PendingPhoto[]>();
      expected.set("1", [makePendingPhoto()]);

      const expectedError = mockOneAsyncStorageFailure("setItem");

      try {
        await Storage.savePendingPhotos(expected);
        throw new Error("Storage.savePendingPhotos was supposed to reject");
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    test("clear succeeds", async () => {
      const expected: PendingPhotos = new Map<string, PendingPhoto[]>();
      expected.set("1", [makePendingPhoto()]);

      const saved = await Storage.savePendingPhotos(expected);
      expect(saved).toEqual(expected);

      await Storage.clearPendingPhotos();
      const received = await Storage.loadPendingPhotos();
      expect(received).toEqual(new Map());
    });

    test("clear fails", async () => {
      const expected: PendingPhotos = new Map<string, PendingPhoto[]>();
      expected.set("1", [makePendingPhoto()]);

      await Storage.savePendingPhotos(expected);
      let loaded = await Storage.loadPendingPhotos();
      expect(loaded).toEqual(expected);

      const expectedError = mockOneAsyncStorageFailure("removeItem");

      try {
        await Storage.clearPendingPhotos();
        throw new Error("clearPendingPhotos was expected to fail");
      } catch (error) {
        expect(error).toEqual(expectedError);
      }

      await Storage.clearPendingPhotos();
      loaded = await Storage.loadPendingPhotos();
      expect(loaded).toEqual(new Map());
    });
  });
});
