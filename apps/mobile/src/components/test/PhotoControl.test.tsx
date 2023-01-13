import React from "react";
import { render } from "@testing-library/react-native";
import { SelectedPhoto } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { PhotoSelector } from "../forms/PhotoSelector";

const navigation: RootStackNavigationProp = {} as RootStackNavigationProp;
navigation.goBack = () => {};
navigation.navigate = () => {};

describe("PhotoSelector test suite", () => {
  test("even number of photos", () => {
    const photos: SelectedPhoto[] = [
      { id: "0", uri: "", height: 16, width: 24 },
      { id: "1", uri: "", height: 24, width: 16 },
    ];

    const { toJSON } = render(
      <PhotoSelector navigation={navigation} photos={photos} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("odd number of photos", () => {
    const photos: SelectedPhoto[] = [
      { id: "0", uri: "", height: 16, width: 24 },
    ];

    const { toJSON } = render(
      <PhotoSelector navigation={navigation} photos={photos} />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
