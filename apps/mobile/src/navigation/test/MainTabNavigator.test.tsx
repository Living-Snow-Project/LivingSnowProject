import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { Navigation } from "../MainTabNavigator";
import { setAppSettings } from "../../../AppSettings";
import { Labels } from "../../constants/Strings";
import { AlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { makeAlgaeRecordsMock } from "../../mocks/useAlgaeRecords.mock";

describe("Navigation test suite", () => {
  test("renders first run screen", () => {
    const { toJSON } = render(
      <NativeBaseProviderForTesting>
        <Navigation />
      </NativeBaseProviderForTesting>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("renders timeline screen", async () => {
    setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
    const algaeRecords = makeAlgaeRecordsMock({
      isEmpty: true,
    });

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <AlgaeRecordsContext.Provider value={algaeRecords}>
          <Navigation />
        </AlgaeRecordsContext.Provider>
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByText(Labels.TimelineScreen.ExampleRecords));
    expect(toJSON()).toMatchSnapshot();
  });
});
