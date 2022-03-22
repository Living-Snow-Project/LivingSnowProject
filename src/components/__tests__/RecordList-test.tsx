import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { PendingRecordList } from "../RecordList";
import {
  RecordReducerStateContext,
  RecordReducerActionsContext,
} from "../../hooks/useRecordReducer";
import {
  makeRecordReducerStateMock,
  makeRecordReducerActionsMock,
} from "../../mocks/useRecordReducer.mock";
import TestIds from "../../constants/TestIds";

const navigation = {
  navigate: jest.fn(),
};
const recordReducerActionsMock = makeRecordReducerActionsMock();
const customRender = () => {
  const recordReducerStateMock = makeRecordReducerStateMock();
  const renderResult = render(
    <RecordReducerStateContext.Provider value={recordReducerStateMock}>
      <RecordReducerActionsContext.Provider value={recordReducerActionsMock}>
        <PendingRecordList navigation={navigation} />
      </RecordReducerActionsContext.Provider>
    </RecordReducerStateContext.Provider>
  );

  return {
    renderResult,
    recordReducerStateMock,
  };
};

describe("PendingRecordList tests", () => {
  test("renders", () => {
    const { toJSON } = customRender().renderResult;
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

    const { getByTestId } = customRender().renderResult;

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

    const { getByTestId } = customRender().renderResult;

    fireEvent.press(getByTestId(TestIds.RecordList.DeleteRecordAction));
    expect(alertMock).toBeCalledTimes(1);
    expect(noButtonMock).toHaveBeenLastCalledWith({
      onPress: expect.any(Function),
      text: "No",
      style: "cancel",
    });

    alertMock.mockReset();
  });

  test("edit record", () => {
    const { recordReducerStateMock, renderResult } = customRender();

    fireEvent.press(
      renderResult.getByTestId(TestIds.RecordList.EditRecordAction)
    );

    expect(navigation.navigate).toBeCalledWith("Record", {
      record: recordReducerStateMock.pendingRecords[0],
    });
  });
});
