import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { SelectedPhoto } from "../../../types";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { PhotoSelector } from "../forms/PhotoSelector";

const navigation: RootStackNavigationProp = {} as RootStackNavigationProp;
navigation.goBack = () => {};
navigation.navigate = () => {};

describe("PhotoSelector test suite", () => {
  test("even number of photos", () => {
    const photos: SelectedPhoto[] = [
      { id: "0", uri: "", height: 16, width: 24 } as SelectedPhoto,
      { id: "1", uri: "", height: 24, width: 16 } as SelectedPhoto,
    ];

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <PhotoSelector navigation={navigation} photos={photos} />
      </NativeBaseProviderForTesting>
    );

    waitFor(() => getByText("Select Photos (limit 4)"));

    expect(toJSON()).toMatchSnapshot();
  });

  test("odd number of photos", () => {
    const photos: SelectedPhoto[] = [
      { id: "0", uri: "", height: 16, width: 24 } as SelectedPhoto,
    ];

    const { getByText, toJSON } = render(
      <NativeBaseProviderForTesting>
        <PhotoSelector navigation={navigation} photos={photos} />
      </NativeBaseProviderForTesting>
    );

    waitFor(() => getByText("Select Photos (limit 4)"));

    expect(toJSON()).toMatchSnapshot();
  });
});
