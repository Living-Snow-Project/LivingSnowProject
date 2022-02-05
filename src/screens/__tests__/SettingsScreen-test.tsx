import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SettingsScreen from "../SettingsScreen";
import { Placeholders } from "../../constants/Strings";
import { getAppSettings } from "../../../AppSettings";

describe("SettingsScreen test suite", () => {
  test("renders", () => {
    const { toJSON } = render(<SettingsScreen />);

    expect(toJSON()).toMatchSnapshot();
  });

  test("user name", async () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <SettingsScreen />
    );
    const username = getByPlaceholderText(Placeholders.Settings.Username);
    const expected = "Test User Name";

    fireEvent.changeText(username, expected);
    expect(getByDisplayValue(expected)).toBeTruthy();
    expect(getAppSettings().name).toEqual(expected);
    fireEvent(username, "onSubmitEditing");
  });

  test("user organization", () => {
    const { getByDisplayValue, getByPlaceholderText } = render(
      <SettingsScreen />
    );
    const organization = getByPlaceholderText(
      Placeholders.Settings.Organization
    );
    const expected = "Test Organization";

    fireEvent.changeText(organization, expected);
    expect(getByDisplayValue(expected)).toBeTruthy();
    expect(getAppSettings().organization).toEqual(expected);
    fireEvent(organization, "onSubmitEditing");
  });

  test.todo("toggle showGpsWarning");
  test.todo("toggle showAtlasRecords");
  test.todo("toggle showOnlyAtlastRecords");
});
