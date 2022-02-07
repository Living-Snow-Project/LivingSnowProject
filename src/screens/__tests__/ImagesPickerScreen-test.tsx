import React from "react";
import { Platform } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ImagesPickerScreen from "../ImagesPickerScreen";

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const route = {
  params: {
    onUpdatePhotos: jest.fn(),
  },
};

describe("ImagesPickerScreen test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ios", async () => {
    const { getByText, toJSON } = render(
      <ImagesPickerScreen navigation={navigation} route={route} />
    );

    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByText("Finish"));
    await waitFor(() => expect(navigation.goBack).toBeCalled());
    expect(route.params.onUpdatePhotos).toBeCalled();
  });

  test("renders android", async () => {
    Platform.OS = "android";
    const { getByText } = render(
      <ImagesPickerScreen navigation={navigation} route={route} />
    );

    fireEvent.press(getByText("Finish"));
    await waitFor(() => expect(navigation.goBack).toBeCalled());
    expect(route.params.onUpdatePhotos).toBeCalled();
    Platform.OS = "ios";
  });
});
