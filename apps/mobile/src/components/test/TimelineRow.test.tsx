import React from "react";
import { render } from "@testing-library/react-native";
import { makeExampleRecord } from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { TimelineRow } from "../TimelineRow";
import { Labels } from "../../constants";

describe("TimelineRow test suite", () => {
  let expectedRecord;

  beforeEach(() => {
    expectedRecord = makeExampleRecord("Sample");
  });

  test("renders", () => {
    const { toJSON } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow record={expectedRecord} />
      </NativeBaseProviderForTesting>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("missing name", () => {
    expectedRecord.name = undefined;

    const { queryByText } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow record={expectedRecord} />
      </NativeBaseProviderForTesting>
    );

    expect(queryByText(new RegExp(Labels.RecordFields.Name))).toBeFalsy();
  });

  test("missing organization", () => {
    expectedRecord.organization = undefined;

    const { queryByText } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow record={expectedRecord} />
      </NativeBaseProviderForTesting>
    );

    expect(
      queryByText(new RegExp(Labels.RecordFields.Organization))
    ).toBeFalsy();
  });

  test("missing location description", () => {
    expectedRecord.locationDescription = undefined;

    const { queryByText } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow record={expectedRecord} />
      </NativeBaseProviderForTesting>
    );

    expect(
      queryByText(new RegExp(Labels.RecordFields.LocationDescription))
    ).toBeFalsy();
  });

  test("missing notes", () => {
    expectedRecord.notes = undefined;

    const { queryByText } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow record={expectedRecord} />
      </NativeBaseProviderForTesting>
    );

    expect(queryByText(new RegExp(Labels.RecordFields.Notes))).toBeFalsy();
  });
});
