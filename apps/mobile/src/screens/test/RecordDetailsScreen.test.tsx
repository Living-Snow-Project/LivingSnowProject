import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as FileSystem from "expo-file-system";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  jsonToRecord,
  makeExamplePhoto,
  makeExampleRecord,
  recordDateFormat,
  Photo,
  AlgaeRecord,
} from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { RecordDetailsScreenRouteProp } from "../../navigation/Routes";
import { RecordDetailsScreen } from "../RecordDetailsScreen";
import { productionExampleRecord } from "../../record/Record";
import { Labels } from "../../constants/Strings";

jest.mock("expo-file-system", () => ({
  downloadAsync: jest.fn(() => Promise.resolve({ md5: "md5", uri: "uri" })),
  getInfoAsync: jest.fn(() =>
    Promise.resolve({ exists: true, md5: "md5", uri: "uri" })
  ),
  readAsStringAsync: jest.fn(() => Promise.resolve()),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  readDirectoryAsync: jest.fn(() => Promise.resolve()),
  createDownloadResumable: jest.fn(() => Promise.resolve()),
  documentDirectory: "file:///test-directory/",
}));

jest
  .spyOn(NetInfo, "fetch")
  .mockResolvedValue({ isConnected: true } as NetInfoState);

/* eslint-disable no-param-reassign */
function setPhotosHeight(photos: Photo[]) {
  photos[0].width = 758;
  photos[0].height = 512;
  photos[1].width = 758;
  photos[1].height = 1024;
}
describe("RecordDetailsScreen test suite", () => {
  test("sample with remote photos", async () => {
    const sampleRecord = makeExampleRecord("Sample");

    if (sampleRecord.photos) {
      setPhotosHeight(sampleRecord.photos);
    }

    const route = {
      params: {
        record: JSON.stringify(sampleRecord),
      },
    } as RecordDetailsScreenRouteProp;

    // only mock once, because makeExampleRecord contains 2 photos, and want to exercise both existing\download code
    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockImplementationOnce(() =>
        Promise.resolve({ exists: false } as FileSystem.FileInfo)
      );

    const downloadAsyncSpy = jest
      .spyOn(FileSystem, "downloadAsync")
      .mockImplementation(() =>
        Promise.resolve({ status: 200 } as FileSystem.FileSystemDownloadResult)
      );

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    expect(toJSON()).toMatchSnapshot();

    // TODO: was never upated for size/colors
    if (
      record.name &&
      record.organization &&
      record.tubeId &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }

    downloadAsyncSpy.mockReset();
  });

  test("sample with remote photos, photo download fails", async () => {
    const sampleRecord = makeExampleRecord("Sample");

    if (sampleRecord.photos) {
      setPhotosHeight(sampleRecord.photos);
    }

    const route = {
      params: {
        record: JSON.stringify(sampleRecord),
      },
    } as RecordDetailsScreenRouteProp;

    const getInfoAsyncSpy = jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockImplementation(() =>
        Promise.resolve({ exists: false } as FileSystem.FileInfo)
      );

    const downloadAsyncSpy = jest
      .spyOn(FileSystem, "downloadAsync")
      .mockImplementation(() =>
        Promise.resolve({ status: 404 } as FileSystem.FileSystemDownloadResult)
      );

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    expect(toJSON()).toMatchSnapshot();

    if (
      record.name &&
      record.organization &&
      record.tubeId &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }

    getInfoAsyncSpy.mockReset();
    downloadAsyncSpy.mockReset();
  });

  test("sample with remote photos, no snapshot", async () => {
    // this test is a little silly but need to test makeExamplePhoto without a hard-coded uri that makeExampleRecord uses
    const sampleRecord = {
      ...makeExampleRecord("Sample"),
      photos: [makeExamplePhoto()],
    };

    const route = {
      params: {
        record: JSON.stringify(sampleRecord),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    if (
      record.name &&
      record.organization &&
      record.tubeId &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("example record with compiled photo", () => {
    const sampleRecord = productionExampleRecord();

    const route = {
      params: {
        record: JSON.stringify(sampleRecord),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    expect(toJSON()).toMatchSnapshot();

    if (
      record.name &&
      record.organization &&
      record.tubeId &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("sighting without photos", () => {
    const sightingRecord = {
      ...makeExampleRecord("Sighting"),
      photos: [],
    };

    const route = {
      params: {
        record: JSON.stringify(sightingRecord),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    if (
      record.name &&
      record.organization &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(queryByText(new RegExp(Labels.TubeId))).toBeFalsy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("sighting omit all optional fields", () => {
    const sightingRecord = {
      ...makeExampleRecord("Sighting"),
      organization: undefined,
      tubeId: undefined,
      locationDescription: undefined,
      notes: undefined,
      photos: undefined,
    };

    const route = {
      params: {
        record: JSON.stringify(sightingRecord),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, queryByText } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    if (record.name) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(queryByText(new RegExp(record.name))).toBeTruthy();
      expect(queryByText(Labels.Organization)).toBeFalsy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(queryByText(Labels.TubeId)).toBeFalsy();
      expect(
        queryByText(Labels.RecordDetailsScreen.LocationDescription)
      ).toBeFalsy();
      expect(queryByText(Labels.RecordDetailsScreen.Notes)).toBeFalsy();
    } else {
      fail("name field was not found");
    }
  });

  // "last test" because we are lazy with NetInfo.fetch mock
  test("sample with remote photos, offline mode", async () => {
    const sampleRecord = makeExampleRecord("Sample");

    if (sampleRecord.photos) {
      setPhotosHeight(sampleRecord.photos);
    }

    const route = {
      params: {
        record: JSON.stringify(sampleRecord),
      },
    } as RecordDetailsScreenRouteProp;

    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockResolvedValue({ exists: false } as FileSystem.FileInfo);

    jest
      .spyOn(NetInfo, "fetch")
      .mockResolvedValue({ isConnected: false } as NetInfoState);

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const record: AlgaeRecord = jsonToRecord(route.params.record);

    expect(toJSON()).toMatchSnapshot();

    if (
      record.name &&
      record.organization &&
      record.tubeId &&
      record.locationDescription &&
      record.notes
    ) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(getByText(new RegExp(record.name))).toBeTruthy();
      expect(getByText(new RegExp(record.organization))).toBeTruthy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });
});
