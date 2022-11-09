import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as FileSystem from "expo-file-system";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { recordDateFormat } from "@livingsnow/record";
import RecordDetailsScreen from "../RecordDetailsScreen";
import {
  makeExampleRecord,
  productionExampleRecord,
} from "../../record/Record";
import { makeExamplePhoto } from "../../record/Photo";
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

describe("RecordDetailsScreen test suite", () => {
  test("sample with remote photos", async () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sample"),
        },
      },
    };

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

    const { getByText, toJSON } = render(<RecordDetailsScreen route={route} />);

    await waitFor(() => getByText(Labels.RecordFields.Photos));

    const { record } = route.params;

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
      expect(getByText(Labels.RecordFields.Photos)).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }

    downloadAsyncSpy.mockReset();
  });

  test("sample with remote photos, photo download fails", async () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sample"),
        },
      },
    };

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

    const { getByText, toJSON } = render(<RecordDetailsScreen route={route} />);

    await waitFor(() => getByText(Labels.RecordFields.Photos));

    const { record } = route.params;

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
      expect(getByText(Labels.RecordFields.Photos)).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }

    getInfoAsyncSpy.mockReset();
    downloadAsyncSpy.mockReset();
  });

  test("sample with remote photos, no snapshot", async () => {
    // this test is a little silly but need to test makeExamplePhoto without a hard-coded uri that makeExampleRecord uses
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sample"),
          photos: [makeExamplePhoto()],
        },
      },
    };

    const { getByText } = render(<RecordDetailsScreen route={route} />);

    await waitFor(() => getByText(Labels.RecordFields.Photos));

    const { record } = route.params;

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
      expect(getByText(Labels.RecordFields.Photos)).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("example record with compiled photo", () => {
    const route = {
      params: {
        record: {
          ...productionExampleRecord(),
        },
      },
    };

    const { getByText, toJSON } = render(<RecordDetailsScreen route={route} />);

    const { record } = route.params;

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
      expect(getByText(Labels.RecordFields.Photos)).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("sighting without photos", () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sighting"),
          photos: [],
        },
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    const { record } = route.params;

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
      expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.locationDescription))).toBeTruthy();
      expect(getByText(new RegExp(record.notes))).toBeTruthy();
      expect(queryByText(Labels.RecordFields.Photos)).toBeFalsy();
    } else {
      fail("one expected field was undefined");
    }
  });

  test("sighting omit all optional fields", () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sighting"),
          organization: undefined,
          tubeId: undefined,
          locationDescription: undefined,
          notes: undefined,
          photos: undefined,
        },
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    const { record } = route.params;

    if (record.name) {
      expect(getByText(new RegExp(record.type))).toBeTruthy();
      expect(queryByText(new RegExp(record.name))).toBeTruthy();
      expect(queryByText(Labels.RecordFields.Organization)).toBeFalsy();
      expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
      expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
      expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
      expect(queryByText(Labels.RecordFields.TubeId)).toBeFalsy();
      expect(queryByText(Labels.RecordFields.LocationDescription)).toBeFalsy();
      expect(queryByText(Labels.RecordFields.Notes)).toBeFalsy();
      expect(queryByText(Labels.RecordFields.Photos)).toBeFalsy();
    } else {
      fail("name field was not found");
    }
  });

  // "last test" because we are lazy with NetInfo.fetch mock
  test("sample with remote photos, offline mode", async () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sample"),
        },
      },
    };

    jest
      .spyOn(FileSystem, "getInfoAsync")
      .mockResolvedValue({ exists: false } as FileSystem.FileInfo);

    jest
      .spyOn(NetInfo, "fetch")
      .mockResolvedValue({ isConnected: false } as NetInfoState);

    const { getByText, toJSON } = render(<RecordDetailsScreen route={route} />);

    await waitFor(() => getByText(Labels.RecordFields.Photos));

    const { record } = route.params;

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
      expect(getByText(Labels.RecordFields.Photos)).toBeTruthy();
    } else {
      fail("one expected field was undefined");
    }
  });
});
