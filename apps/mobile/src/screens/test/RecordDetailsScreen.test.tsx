import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  makeExamplePhoto,
  makeExampleRecord,
  recordDateFormat,
  Photo,
} from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { RecordDetailsScreenRouteProp } from "../../navigation/Routes";
import { RecordDetailsScreen } from "../RecordDetailsScreen";
import { productionExampleRecord } from "../../record/Record";
import { Labels } from "../../constants/Strings";
import { MinimalAlgaeRecord } from "../../../types";

// https://github.com/expo/expo/issues/23591
jest.mock("expo-font");

jest.mock("expo-file-system", () => ({
  downloadAsync: jest.fn(() =>
    Promise.resolve({ status: 200, md5: "md5", uri: "uri" }),
  ),
  getInfoAsync: jest.fn(() =>
    Promise.resolve({ exists: true, md5: "md5", uri: "uri" }),
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

function setPhotosHeight(photos: Photo[]) {
  photos[0].width = 758;
  photos[0].height = 512;
  photos[1].width = 758;
  photos[1].height = 1024;
}

describe("RecordDetailsScreen test suite", () => {
  test("sample with remote photos", async () => {
    const record = makeExampleRecord("Sample");
    const photos = [
      makeExamplePhoto({ isLocal: false }),
      makeExamplePhoto({ isLocal: false }),
    ];

    setPhotosHeight(photos);

    const minimalRecord: MinimalAlgaeRecord = {
      record,
      photos,
    };

    const route = {
      params: {
        record: JSON.stringify(minimalRecord),
      },
    } as RecordDetailsScreenRouteProp;

    // only mock once, because makeExampleRecord contains 2 photos, and want to exercise both existing and download scenarios
    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo);

    jest.spyOn(ImageManipulator, "manipulateAsync").mockResolvedValueOnce({
      uri: "new-uri",
      base64: 0,
    } as unknown as ImageManipulator.ImageResult);

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

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
      throw Error("one expected field was undefined");
    }
  });

  test("sample with remote photos, photo download fails", async () => {
    const record = makeExampleRecord("Sample");
    const photos = [
      makeExamplePhoto({ isLocal: false }),
      makeExamplePhoto({ isLocal: false }),
    ];

    setPhotosHeight(photos);

    const minimalRecord: MinimalAlgaeRecord = {
      record,
      photos,
    };

    const route = {
      params: {
        record: JSON.stringify(minimalRecord),
      },
    } as RecordDetailsScreenRouteProp;

    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo);

    jest
      .spyOn(FileSystem, "downloadAsync")
      .mockResolvedValueOnce({
        status: 404,
      } as FileSystem.FileSystemDownloadResult)
      .mockResolvedValueOnce({
        status: 404,
      } as FileSystem.FileSystemDownloadResult);

    const { getAllByText, getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getAllByText("Error"));

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
      throw Error("one expected field was undefined");
    }
  });

  test("example record with compiled photo", async () => {
    const sample = productionExampleRecord();

    const route = {
      params: {
        record: JSON.stringify(sample),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const { record } = sample;

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
      throw Error("one expected field was undefined");
    }
  });

  test("sighting without photos", async () => {
    const sighting: MinimalAlgaeRecord = {
      record: { ...makeExampleRecord("Sighting") },
    };

    const route = {
      params: {
        record: JSON.stringify(sighting),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, queryByText } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const { record } = sighting;

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
      throw Error("one expected field was undefined");
    }
  });

  test("sighting omit all optional fields", async () => {
    const sighting: MinimalAlgaeRecord = {
      record: {
        ...makeExampleRecord("Sighting"),
        organization: undefined,
        tubeId: undefined,
        locationDescription: undefined,
        notes: undefined,
      },
    };

    const route = {
      params: {
        record: JSON.stringify(sighting),
      },
    } as RecordDetailsScreenRouteProp;

    const { getByText, queryByText } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

    const { record } = sighting;

    if (record.name) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(queryByText(new RegExp(record.name))).toBeTruthy();
      expect(queryByText(Labels.Organization)).toBeFalsy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(queryByText(Labels.TubeId)).toBeFalsy();
      expect(
        queryByText(Labels.RecordDetailsScreen.LocationDescription),
      ).toBeFalsy();
      expect(queryByText(Labels.RecordDetailsScreen.Notes)).toBeFalsy();
    } else {
      throw Error("name field was not found");
    }
  });

  // "last test" because we are lazy with NetInfo.fetch mock
  test("sample with remote photos, offline mode", async () => {
    const record = makeExampleRecord("Sample");
    const photos = [
      makeExamplePhoto({ isLocal: false }),
      makeExamplePhoto({ isLocal: false }),
    ];

    setPhotosHeight(photos);

    const minimalRecord: MinimalAlgaeRecord = {
      record,
      photos,
    };

    const route = {
      params: {
        record: JSON.stringify(minimalRecord),
      },
    } as RecordDetailsScreenRouteProp;

    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo)
      .mockResolvedValueOnce({ exists: false } as FileSystem.FileInfo);

    jest
      .spyOn(NetInfo, "fetch")
      .mockResolvedValueOnce({ isConnected: false } as NetInfoState)
      .mockResolvedValueOnce({ isConnected: false } as NetInfoState);

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <RecordDetailsScreen route={route} />
      </NativeBaseProviderForTesting>,
    );

    await waitFor(() => getByText(Labels.RecordDetailsScreen.DataSheet));

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
      throw Error("one expected field was undefined");
    }
  });
});
