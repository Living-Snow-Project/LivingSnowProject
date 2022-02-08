import React from "react";
import { render } from "@testing-library/react-native";
import TimelineRow from "../TimelineRow";
import { makeExampleRecord } from "../../record/Record";
import TestIds from "../../constants/TestIds";

describe("TimelineRow test suite", () => {
  let expectedRecord;

  beforeEach(() => {
    expectedRecord = makeExampleRecord("Sample");
  });

  test("renders", () => {
    const { toJSON } = render(<TimelineRow record={expectedRecord} />);

    expect(toJSON()).toMatchSnapshot();
  });

  test("sample icon", () => {
    const { queryByTestId } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByTestId(TestIds.Icons.SampleIcon)).toBeTruthy();
  });

  test("sighting icon", () => {
    expectedRecord = makeExampleRecord("Sighting");

    const { queryByTestId } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByTestId(TestIds.Icons.SightingIcon)).toBeTruthy();
  });

  test("missing name", () => {
    expectedRecord.name = undefined;

    const { queryByText } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByText(/Name/)).toBeFalsy();
  });

  test("missing organization", () => {
    expectedRecord.organization = undefined;

    const { queryByText } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByText(/Organization/)).toBeFalsy();
  });

  test("missing location description", () => {
    expectedRecord.locationDescription = undefined;

    const { queryByText } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByText(/Location Description/)).toBeFalsy();
  });

  test("missing notes", () => {
    expectedRecord.notes = undefined;

    const { queryByText } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByText(/Notes/)).toBeFalsy();
  });

  test("photos icon", () => {
    const { queryByTestId } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByTestId(TestIds.Icons.PictureIcon)).toBeTruthy();
  });

  test("no photos icon", () => {
    expectedRecord.photoUris = undefined;

    const { queryByTestId } = render(<TimelineRow record={expectedRecord} />);

    expect(queryByTestId(TestIds.Icons.PictureIcon)).toBeFalsy();
  });
});
