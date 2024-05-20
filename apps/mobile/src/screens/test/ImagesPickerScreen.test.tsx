import React from "react";
import { Platform } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import {
  ImagesPickerScreenNavigationProp,
  ImagesPickerScreenRouteProp,
} from "../../navigation/Routes";
import { ImagesPickerScreen } from "../ImagesPickerScreen";
import { TestIds } from "../../constants/TestIds";

// record action button renders independently of the screen
let photoSelectedActionButton: JSX.Element;

const navigation = {} as ImagesPickerScreenNavigationProp;
navigation.navigate = jest.fn();
navigation.setOptions = ({
  headerRight,
}: {
  headerRight: () => JSX.Element;
}) => {
  photoSelectedActionButton = (
    <NativeBaseProviderForTesting>{headerRight()}</NativeBaseProviderForTesting>
  );
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
      <NativeBaseProviderForTesting>
        <ImagesPickerScreen navigation={navigation} route={route} />
      </NativeBaseProviderForTesting>,
    );

    const { getByTestId } = render(photoSelectedActionButton);

    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId(TestIds.Icons.DoneSelectingPhotosIcon));
    await waitFor(() => expect(navigation.navigate).toBeCalled());
  });

  test("renders android", async () => {
    Platform.OS = "android";

    render(
      <NativeBaseProviderForTesting>
        <ImagesPickerScreen navigation={navigation} route={route} />
      </NativeBaseProviderForTesting>,
    );

    const { getByTestId } = render(photoSelectedActionButton);

    fireEvent.press(getByTestId(TestIds.Icons.DoneSelectingPhotosIcon));
    await waitFor(() => expect(navigation.navigate).toBeCalled());
    Platform.OS = "ios";
  });
});
