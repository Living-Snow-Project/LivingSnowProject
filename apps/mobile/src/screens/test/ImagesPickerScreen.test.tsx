import React from "react";
import { Platform } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import {
  ImagesPickerScreenNavigationProp,
  ImagesPickerScreenRouteProp,
} from "../../navigation/Routes";
import ImagesPickerScreen from "../ImagesPickerScreen";
import TestIds from "../../constants/TestIds";

// record action button renders independently of the screen
let photoSelectedActionButton: () => JSX.Element;

const navigation = {} as ImagesPickerScreenNavigationProp;
navigation.navigate = jest.fn();
navigation.goBack = jest.fn();
navigation.setOptions = ({
  headerRight,
}: {
  headerRight: () => JSX.Element;
}) => {
  photoSelectedActionButton = headerRight;
};

const route = {
  params: {
    onUpdatePhotos: jest.fn(),
  },
} as unknown as ImagesPickerScreenRouteProp;

describe("ImagesPickerScreen test suite", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ios", async () => {
    const { toJSON } = render(
      <ImagesPickerScreen navigation={navigation} route={route} />
    );

    const { getByTestId } = render(photoSelectedActionButton());

    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId(TestIds.Icons.DoneSelectingPhotosIcon));
    await waitFor(() => expect(navigation.goBack).toBeCalled());
    expect(route.params.onUpdatePhotos).toBeCalled();
  });

  test("renders android", async () => {
    Platform.OS = "android";

    render(<ImagesPickerScreen navigation={navigation} route={route} />);

    const { getByTestId } = render(photoSelectedActionButton());

    fireEvent.press(getByTestId(TestIds.Icons.DoneSelectingPhotosIcon));
    await waitFor(() => expect(navigation.goBack).toBeCalled());
    expect(route.params.onUpdatePhotos).toBeCalled();
    Platform.OS = "ios";
  });
});
