import React from "react";
import { render } from "@testing-library/react-native";
import RecordDetailsScreen from "../RecordDetailsScreen";
import { makeExampleRecord } from "../../record/Record";

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
    expect(queryByText(/Atlas/)).toBeFalsy();
    expect(queryByText(/Photos/)).toBeTruthy();
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
    expect(queryByText(/TubeId/)).toBeFalsy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(
      getByText(new RegExp(route.params.locationDescription))
    ).toBeTruthy();
    expect(getByText(new RegExp(route.params.notes))).toBeTruthy();
    expect(queryByText(/Atlas/)).toBeFalsy();
    expect(queryByText(/Photos/)).toBeFalsy();
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
    expect(queryByText(/TubeId/)).toBeFalsy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(
      getByText(new RegExp(route.params.locationDescription))
    ).toBeTruthy();
    expect(getByText(new RegExp(route.params.notes))).toBeTruthy();
    expect(getByText(/Atlas Surface Data/)).toBeTruthy();
    expect(getByText(/Photos/)).toBeTruthy();
  });

  test("sighting omit all optional fields", () => {
    const route = {
      params: {
        ...makeExampleRecord("Sighting"),
        organization: null,
        tubeId: null,
        locationDesciption: null,
        notes: null,
        photoUris: null,
      },
    };

    const { getByText, queryByText } = render(
      <RecordDetailsScreen route={route} />
    );

    expect(getByText(new RegExp(route.params.type))).toBeTruthy();
    expect(queryByText(new RegExp(route.params.name))).toBeTruthy();
    expect(queryByText(/Organization/)).toBeFalsy();
    expect(getByText(new RegExp(route.params.date))).toBeTruthy();
    expect(getByText(new RegExp(route.params.latitude))).toBeTruthy();
    expect(getByText(new RegExp(route.params.longitude))).toBeTruthy();
    expect(queryByText(/TubeId/)).toBeFalsy();
    expect(queryByText(/Location Description/)).toBeFalsy();
    expect(queryByText(/Notes/)).toBeFalsy();
    expect(queryByText(/Atlas/)).toBeFalsy();
    expect(queryByText(/Photos/)).toBeFalsy();
  });
});
