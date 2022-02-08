import React from "react";
import { render } from "@testing-library/react-native";
import RecordDetailsScreen from "../RecordDetailsScreen";
import { makeExampleRecord } from "../../record/Record";
import { Labels } from "../../constants/Strings";

describe("RecordDetailsScreen test suite", () => {
  test("sample with remote photos", () => {
    const route = {
      params: {
        ...makeExampleRecord("Sample"),
      },
    };

    const { getByText, queryByText, toJSON } = render(
      <RecordDetailsScreen route={route} />
    );

    expect(toJSON()).toMatchSnapshot();
    expect(getByText(new RegExp(route.params.type))).toBeTruthy();
    expect(getByText(new RegExp(route.params.name))).toBeTruthy();
    expect(getByText(new RegExp(route.params.organization))).toBeTruthy();
    expect(getByText(new RegExp(route.params.date))).toBeTruthy();
    expect(getByText(new RegExp(route.params.tubeId))).toBeTruthy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(
      getByText(new RegExp(route.params.locationDescription))
    ).toBeTruthy();
    expect(getByText(new RegExp(route.params.notes))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Photos))).toBeTruthy();
  });

  test("sighting without photos", () => {
    const route = {
      params: {
        ...makeExampleRecord("Sighting"),
        photoUris: null,
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    expect(getByText(new RegExp(route.params.type))).toBeTruthy();
    expect(getByText(new RegExp(route.params.name))).toBeTruthy();
    expect(getByText(new RegExp(route.params.organization))).toBeTruthy();
    expect(getByText(new RegExp(route.params.date))).toBeTruthy();
    expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(
      getByText(new RegExp(route.params.locationDescription))
    ).toBeTruthy();
    expect(getByText(new RegExp(route.params.notes))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeFalsy();
    expect(queryByText(new RegExp(Labels.RecordFields.Photos))).toBeFalsy();
  });

  test("atlas with local photos", () => {
    const route = {
      params: {
        ...makeExampleRecord("AtlasRedDot"),
        photoUris: "file://one.jpg;",
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    expect(getByText(new RegExp(route.params.type))).toBeTruthy();
    expect(getByText(new RegExp(route.params.name))).toBeTruthy();
    expect(getByText(new RegExp(route.params.organization))).toBeTruthy();
    expect(getByText(new RegExp(route.params.date))).toBeTruthy();
    expect(queryByText(new RegExp(Labels.RecordFields.TubeId))).toBeFalsy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(
      getByText(new RegExp(route.params.locationDescription))
    ).toBeTruthy();
    expect(getByText(new RegExp(route.params.notes))).toBeTruthy();
    // TODO: check for Atlas: Red Dot (when string lookup exists)
    expect(
      getByText(new RegExp(Labels.RecordFields.AtlasSnowSurface))
    ).toBeTruthy();
    expect(getByText(new RegExp(Labels.RecordFields.Photos))).toBeTruthy();
  });

  test("sighting omit all optional fields", () => {
    const route = {
      params: {
        ...makeExampleRecord("Sighting"),
        organization: null,
        tubeId: null,
        locationDescription: null,
        notes: null,
        photoUris: null,
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    expect(getByText(new RegExp(route.params.type))).toBeTruthy();
    expect(queryByText(new RegExp(route.params.name))).toBeTruthy();
    expect(
      queryByText(new RegExp(Labels.RecordFields.Organization))
    ).toBeFalsy();
    expect(getByText(new RegExp(route.params.date))).toBeTruthy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
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
