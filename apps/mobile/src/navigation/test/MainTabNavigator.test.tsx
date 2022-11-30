import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Navigation from "../MainTabNavigator";
import { setAppSettings } from "../../../AppSettings";
import { Labels } from "../../constants/Strings";
import { AlgaeRecordsContext } from "../../hooks/useAlgaeRecords";
import { makeRecordReducerActionsMock } from "../../mocks/useRecordReducer.mock";

describe("Navigation test suite", () => {
  test("renders first run screen", () => {
    const { toJSON } = render(<Navigation />);

    expect(toJSON()).toMatchSnapshot();
  });

  test("renders timeline screen", async () => {
    setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
    const recordReducerActionsMock = makeRecordReducerActionsMock();

    const { getByText, toJSON } = render(
      <AlgaeRecordsContext.Provider value={recordReducerActionsMock}>
        <Navigation />
      </AlgaeRecordsContext.Provider>
    );

    await waitFor(() => getByText(Labels.TimelineScreen.ExampleRecords));
    expect(toJSON()).toMatchSnapshot();
  });
});
