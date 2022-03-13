import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { PendingRecordList } from "../RecordList";
import {
  RecordReducerStateContext,
  RecordReducerActionsContext,
} from "../../hooks/useRecordReducer";
import {
  recordReducerStateMock,
  recordReducerActionsMock,
} from "../../mocks/useRecordReducer.mock";
import TestIds from "../../constants/TestIds";

const customRender = () =>
  render(
    <RecordReducerStateContext.Provider value={recordReducerStateMock}>
      <RecordReducerActionsContext.Provider value={recordReducerActionsMock}>
        <PendingRecordList />
      </RecordReducerActionsContext.Provider>
    </RecordReducerStateContext.Provider>
  );

describe("PendingRecordList tests", () => {
  test("renders", () => {
    const { toJSON } = customRender();
    expect(toJSON()).toMatchSnapshot();
  });

  test("confirm delete record", async () => {
    let okPressed = false;
    const alertMock = jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) => {
        // @ts-ignore
        buttons[0].onPress(); // "Yes" button
        okPressed = true;
      });

    const { getByTestId } = customRender();

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
    await waitFor(() => expect(okPressed).toBe(true));

    expect(alertMock).toBeCalledTimes(1);
    expect(recordReducerActionsMock.delete).toBeCalledTimes(1);
    alertMock.mockReset();
  });

  test("cancel delete record", () => {
    const noButtonMock = jest.fn();
    const alertMock = jest
      .spyOn(Alert, "alert")
      .mockImplementationOnce((title, message, buttons) => {
        // @ts-ignore
        noButtonMock(buttons[1]); // "No" button
      });

    const { getByTestId } = customRender();

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
    expect(alertMock).toBeCalledTimes(1);
    expect(noButtonMock).toHaveBeenLastCalledWith({
      onPress: expect.any(Function),
      text: "No",
      style: "cancel",
    });

    alertMock.mockReset();
  });

  // TODO: placeholder for now
  test("edit record", () => {
    const { getByTestId } = customRender();

    fireEvent.press(getByTestId(TestIds.RecordList.EditRecordAction));
  });
});
