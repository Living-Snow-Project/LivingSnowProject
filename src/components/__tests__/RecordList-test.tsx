import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { PendingRecordList } from "../RecordList";
import { makeExampleRecord } from "../../record/Record";
import TestIds from "../../constants/TestIds";

describe("PendingRecordList tests", () => {
  test("renders", () => {
    const { toJSON } = render(
      <PendingRecordList
        records={[makeExampleRecord("Sighting")]}
        onUpdate={() => {}}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("confirm delete record", async () => {
    let okPressed = false;
    const onUpdateMock = jest.fn();
    const alertMock = jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) => {
        // @ts-ignore
        buttons[0].onPress(); // "Yes" button
        okPressed = true;
      });

    const { getByTestId } = render(
      <PendingRecordList
        records={[makeExampleRecord("Sighting")]}
        onUpdate={onUpdateMock}
      />
    );

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
    await waitFor(() => expect(okPressed).toBe(true));

    expect(alertMock).toBeCalledTimes(1);
    expect(onUpdateMock).toBeCalled();
    alertMock.mockReset();
  });

  test("cancel delete record", () => {
    const noButtonMock = jest.fn();
    const alertMock = jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) => {
        // @ts-ignore
        noButtonMock({ text: buttons[1].text, style: buttons[1].style }); // "No" button
      });

    const { getByTestId } = render(
      <PendingRecordList
        records={[makeExampleRecord("Sighting")]}
        onUpdate={() => {}}
      />
    );

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
    expect(alertMock).toBeCalledTimes(1);
    expect(noButtonMock).toHaveBeenLastCalledWith({
      text: "No",
      style: "cancel",
    });
  });

  test("edit record", () => {
    const { getByTestId } = render(
      <PendingRecordList
        records={[makeExampleRecord("Sighting")]}
        onUpdate={() => {}}
      />
    );

    fireEvent.press(getByTestId(TestIds.RecordList.EditRecordAction));
  });
});
