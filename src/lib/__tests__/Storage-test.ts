import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import * as Storage from "../Storage";
import { AppSettings } from "../../../@types/AppSettings";
import { Record, makeExampleRecord } from "../../record/Record";

const makeTestAppConfig = (): AppSettings => ({
  name: "Test Name",
  organization: "Test Org",
  showFirstRun: true,
  showGpsWarning: false,
  showAtlasRecords: true,
  showOnlyAtlasRecords: false,
});

// TODO: move to Photo type file and import
const makeExamplePhoto = () => ({
  id: "test photo id",
  photoStream: "file://test/filepath",
});

const mockOneAsyncStorageFailure = (method: string): Error => {
  const error = Error(`mocked ${method} error`);
  jest
    .spyOn(mockAsyncStorage, method)
    .mockImplementationOnce(() => Promise.reject(error));

  return error;
};

describe("Storage test suite", () => {
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

    await Storage.saveAppConfig(null as unknown as AppSettings);
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

    // @ts-ignore
    await Storage.saveRecords(expected);
    const received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

  test("saveRecords with empty records doesn't overwrite existing records", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    // @ts-ignore
    await Storage.saveRecords(expected);
    let received = await Storage.loadRecords();
    expect(received).toEqual(expected);

    await Storage.saveRecords(null as unknown as Record[]);
    received = await Storage.loadRecords();
    expect(received).toEqual(expected);
  });

  test("saveRecords fails", async () => {
    const expected = [makeExampleRecord("Sighting")];
    const expectedError = mockOneAsyncStorageFailure("setItem");

    // @ts-ignore
    const received = await Storage.saveRecords(expected);
    expect(received).toEqual(expectedError);
  });

  test("clearRecords succeeds", async () => {
    const expected = [
      makeExampleRecord("Sample"),
      makeExampleRecord("Sighting"),
    ];

    // @ts-ignore
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

    // @ts-ignore
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

    // @ts-ignore
    await Storage.saveRecord(expected);
    const received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);
  });

  test("saveRecord with emptry record doesn't change existing records", async () => {
    const expected = makeExampleRecord("Sample");

    // @ts-ignore
    await Storage.saveRecord(expected);
    let received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);

    await Storage.saveRecord(null as unknown as Record);
    received = await Storage.loadRecords();
    expect(received[0]).toEqual(expected);
  });

  test("saveRecord fails", async () => {
    const expected = makeExampleRecord("Sighting");
    const expectedError = mockOneAsyncStorageFailure("setItem");

    // @ts-ignore
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
