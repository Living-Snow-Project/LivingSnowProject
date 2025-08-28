import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import {
  makeExampleRecord,
  makeExamplePhoto,
  AlgaeRecord,
} from "@livingsnow/record";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { TimelineRow } from "../screens";
import { Labels } from "../../constants";
import { MinimalAlgaeRecord } from "../../../types";

describe("TimelineRow test suite", () => {
  const expectedRecord: MinimalAlgaeRecord = {
    record: {} as AlgaeRecord,
    photos: undefined,
  };

  beforeEach(() => {
    expectedRecord.record = makeExampleRecord("Sample");
    expectedRecord.photos = [makeExamplePhoto({ width: 720, height: 480 })];
  });

  test("renders", () => {
    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow
          record={expectedRecord.record}
          photos={expectedRecord.photos}
        />
      </NativeBaseProviderForTesting>,
    );

    // name = "test name"
    waitFor(() => getByText("TN"));

    expect(toJSON()).toMatchSnapshot();
  });

  test("missing name", () => {
    expectedRecord.record.name = undefined;

    const { getByText } = render(
      <NativeBaseProviderForTesting>
        <TimelineRow
          record={expectedRecord.record}
          photos={expectedRecord.photos}
        />
      </NativeBaseProviderForTesting>,
    );

    waitFor(() => getByText(Labels.DefaultName));
  });
});
