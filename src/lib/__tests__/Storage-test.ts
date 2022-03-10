import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import * as Storage from "../Storage";
import { makeExampleRecord } from "../../record/Record";
import { makeExamplePendingPhoto } from "../../record/Photo";

const makeTestAppConfig = (): AppSettings => ({
  name: "Test Name",
  organization: "Test Org",
  showFirstRun: true,
  showGpsWarning: false,
  showAtlasRecords: true,
  showOnlyAtlasRecords: false,
});

const makeExamplePhoto = (): PendingPhoto =>
  makeExamplePendingPhoto({ isLocal: true });

const mockOneAsyncStorageFailure = (method: string): Error => {
  const error = Error(`mocked ${method} error`);
  jest
    .spyOn(mockAsyncStorage, method)
    .mockImplementationOnce(() => Promise.reject(error));

  return error;
};

describe("Storage test suite", () => {
  afterEach(() => {
    Storage.clearRecords();
    Storage.clearPhotos();
  });

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

  test("loadRecords succeeds with no records", async () => {
    const received = await Storage.loadRecords();
    expect(received).toEqual([]);
  });

  test("loadRecords fails", async () => {
    mockOneAsyncStorageFailure("getItem");
    const received = await Storage.loadRecords();
    expect(received).toEqual([]);
  });

  test("saveRecords succeeds", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    await Storage.saveRecords(expected);
    const received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

  test("saveRecords with empty records doesn't overwrite existing records", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    await Storage.saveRecords(expected);
    let received = await Storage.loadRecords();
    expect(received).toEqual(expected);

    // @ts-ignore
    await Storage.saveRecords(null);
    received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

  test("saveRecords fails", async () => {
    const expected = [makeExampleRecord("Sighting")];
    const expectedError = mockOneAsyncStorageFailure("setItem");

    const received = await Storage.saveRecords(expected);
    expect(received).toEqual(expectedError);
  });

  test("deleteRecord removes record", async () => {
    const expected = [
      { ...makeExampleRecord("Sample"), id: 1 },
      { ...makeExampleRecord("Sighting"), id: 2 },
      { ...makeExampleRecord("Atlas: Blue Dot"), id: 3 },
    ];

    await Storage.saveRecords(expected);
    await Storage.deleteRecord(expected[1]);

    const received = await Storage.loadRecords();
    const newExpected = [expected[0], expected[2]];
    expect(received).toEqual(newExpected);
  });

  test("deleteRecord with record that does not exist", async () => {
    const expected = [
      { ...makeExampleRecord("Sample"), id: 1 },
      { ...makeExampleRecord("Sighting"), id: 2 },
      { ...makeExampleRecord("Atlas: Blue Dot"), id: 3 },
    ];

    await Storage.saveRecords(expected);
    await Storage.deleteRecord(makeExampleRecord("Atlas: Red Dot"));

    const received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

  test("deleteRecord empty record", async () => {
    const expected = [
      { ...makeExampleRecord("Sample"), id: 1 },
      { ...makeExampleRecord("Sighting"), id: 2 },
      { ...makeExampleRecord("Atlas: Blue Dot"), id: 3 },
    ];

    await Storage.saveRecords(expected);
    // @ts-ignore
    await Storage.deleteRecord(null);

    const received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

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

    await Storage.saveCachedRecords(expected);
    const received = await Storage.loadCachedRecords();
    expect(received).toEqual(expected);
  });

  test("saveCachedRecords with empty records doesn't overwrite existing records", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    await Storage.saveCachedRecords(expected);
    let received = await Storage.loadCachedRecords();
    expect(received).toEqual(expected);

    // @ts-ignore
    await Storage.saveCachedRecords(null);
    received = await Storage.loadCachedRecords();
    expect(received).toEqual(expected);
  });

  test("saveCachedRecords fails", async () => {
    const expected = [makeExampleRecord("Sighting")];
    const expectedError = mockOneAsyncStorageFailure("setItem");

    const received = await Storage.saveCachedRecords(expected);
    expect(received).toEqual(expectedError);
  });

  test("clearRecords succeeds", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    await Storage.saveRecords(expected);
    let received = await Storage.loadRecords();
    expect(received).toEqual(expected);

    await Storage.clearRecords();
    received = await Storage.loadRecords();
    expect(received).toEqual([]);
  });

  test("clearRecords fails", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    await Storage.saveRecords(expected);
    let received = await Storage.loadRecords();
    expect(received).toEqual(expected);

    const expectedError = mockOneAsyncStorageFailure("removeItem");
    const receievedError = await Storage.clearRecords();
    expect(receievedError).toEqual(expectedError);

    await Storage.clearRecords();
    received = await Storage.loadRecords();
    expect(received).toEqual([]);
  });

  test("saveRecord succeeds", async () => {
    const expected = makeExampleRecord("Sample");

    await Storage.saveRecord(expected);
    const received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);
  });

  test("saveRecord with empty record doesn't change existing records", async () => {
    const expected = makeExampleRecord("Sample");

    await Storage.saveRecord(expected);
    let received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);

    // @ts-ignore
    await Storage.saveRecord(null);
    received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);
  });

  test("saveRecord fails", async () => {
    const expected = makeExampleRecord("Sighting");
    const expectedError = mockOneAsyncStorageFailure("setItem");

    const received = await Storage.saveRecord(expected);
    expect(received).toEqual(expectedError);
  });

  test("loadPhotos succeeds with no photos", async () => {
    const received = await Storage.loadPhotos();
    expect(received).toEqual([]);
  });

  test("loadPhotos fails", async () => {
    mockOneAsyncStorageFailure("getItem");
    const received = await Storage.loadPhotos();
    expect(received).toEqual([]);
  });

  test("savePhotos succeeds", async () => {
    const expected = [makeExamplePhoto()];

    await Storage.savePhotos(expected);
    const received = await Storage.loadPhotos();
    expect(received).toEqual(expected);
  });

  test("savePhotos with empty photos doesn't overwrite existing photos", async () => {
    const expected = [makeExamplePhoto()];

    await Storage.savePhotos(expected);
    let received = await Storage.loadPhotos();
    expect(received).toEqual(expected);

    // @ts-ignore
    await Storage.savePhotos(null);
    received = await Storage.loadPhotos();
    expect(received).toEqual(expected);
  });

  test("savePhotos fails", async () => {
    const expected = [makeExamplePhoto()];
    const expectedError = mockOneAsyncStorageFailure("setItem");

    const received = await Storage.savePhotos(expected);
    expect(received).toEqual(expectedError);
  });

  test("clearPhotos succeeds", async () => {
    const expected = [makeExamplePhoto()];

    await Storage.savePhotos(expected);
    let received = await Storage.loadPhotos();
    expect(received).toEqual(expected);

    await Storage.clearPhotos();
    received = await Storage.loadPhotos();
    expect(received).toEqual([]);
  });

  test("clearPhotos fails", async () => {
    const expected = [makeExamplePhoto()];

    await Storage.savePhotos(expected);
    let received = await Storage.loadPhotos();
    expect(received).toEqual(expected);

    const expectedError = mockOneAsyncStorageFailure("removeItem");
    const receievedError = await Storage.clearPhotos();
    expect(receievedError).toEqual(expectedError);

    await Storage.clearPhotos();
    received = await Storage.loadPhotos();
    expect(received).toEqual([]);
  });

  test("savePhoto succeeds", async () => {
    const expected = makeExamplePhoto();

    await Storage.savePhoto(expected);
    const received = await Storage.loadPhotos();
    expect(received[0]).toEqual(expected);
  });

  test("savePhoto with empty photos doesn't change existing photos", async () => {
    const expected = makeExamplePhoto();

    await Storage.savePhoto(expected);
    let received = await Storage.loadPhotos();
    expect(received[0]).toEqual(expected);

    // @ts-ignore
    await Storage.savePhoto(null);
    received = await Storage.loadPhotos();
    expect(received[0]).toEqual(expected);
  });

  test("savePhoto fails", async () => {
    const expected = makeExamplePhoto();
    const expectedError = mockOneAsyncStorageFailure("setItem");

    const received = await Storage.savePhoto(expected);
    expect(received).toEqual(expectedError);
  });
});
