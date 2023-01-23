import React from "react";
import { render } from "@testing-library/react-native";
import {
  AlgaeRecord,
  makeExampleRecord,
  makeExamplePhoto,
} from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { TimelineRow } from "../screens";
import { Labels } from "../../constants";

describe("TimelineRow test suite", () => {
  let expectedRecord: AlgaeRecord;

  beforeEach(() => {
    expectedRecord = makeExampleRecord("Sample");
    expectedRecord.photos = [makeExamplePhoto({ width: 720, height: 480 })];
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

    expect(queryByText(Labels.DefaultName)).toBeTruthy();
  });
});
