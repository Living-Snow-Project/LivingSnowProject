import React from "react";
import { render } from "@testing-library/react-native";
import RecordDetailsScreen from "../RecordDetailsScreen";
import { makeExampleRecord, recordDateFormat } from "../../record/Record";
import { Labels } from "../../constants/Strings";

describe("RecordDetailsScreen test suite", () => {
  test("sample with remote photos", () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Sample"),
        },
      },
    };

    const { getByText, queryByText, toJSON } = render(
      <RecordDetailsScreen route={route} />
    );

    const { record } = route.params;

    expect(toJSON()).toMatchSnapshot();
    expect(getByText(new RegExp(record.type))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.name))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.organization))).toBeTruthy();
    expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.tubeId))).toBeTruthy();
    expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
    expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
    expect(
      // @ts-ignore
      getByText(new RegExp(record.locationDescription))
    ).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.notes))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Photos))).toBeTruthy();
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

    expect(getByText(new RegExp(record.type))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.name))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.organization))).toBeTruthy();
    expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
    expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
    expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
    expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
    expect(
      // @ts-ignore
      getByText(new RegExp(record.locationDescription))
    ).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.notes))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Photos))).toBeFalsy();
  });

  test("atlas with local photos", () => {
    const route = {
      params: {
        record: {
          ...makeExampleRecord("Atlas: Red Dot"),
          photos: [
            {
              uri: "file://local-photo.jpg",
              size: 1024,
              width: 256,
              height: 480,
            },
          ],
        },
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    const { record } = route.params;

    expect(getByText(new RegExp(record.type))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.name))).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.organization))).toBeTruthy();
    expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
    expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
    expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
    expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
    expect(
      // @ts-ignore
      getByText(new RegExp(record.locationDescription))
    ).toBeTruthy();
    // @ts-ignore
    expect(getByText(new RegExp(record.notes))).toBeTruthy();
    expect(
      getByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeTruthy();
    expect(getByText(new RegExp(Labels.RecordFields.Photos))).toBeTruthy();
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
          photos: [],
        },
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    const { record } = route.params;

    expect(getByText(new RegExp(record.type))).toBeTruthy();
    // @ts-ignore
    expect(queryByText(new RegExp(record.name))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.Organization))
    ).toBeFalsy();
    expect(getByText(new RegExp(recordDateFormat(record.date)))).toBeTruthy();
    expect(getByText(new RegExp(record.latitude.toString()))).toBeTruthy();
    expect(getByText(new RegExp(record.longitude.toString()))).toBeTruthy();
    expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.LocationDescription))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Notes))).toBeFalsy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Photos))).toBeFalsy();
  });
});
