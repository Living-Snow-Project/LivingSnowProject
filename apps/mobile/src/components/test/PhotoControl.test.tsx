import React from "react";
import { render } from "@testing-library/react-native";
import { Photo } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import PhotoControl from "../PhotoControl";

const navigation: RootStackNavigationProp = {} as RootStackNavigationProp;
navigation.goBack = () => {};
navigation.navigate = () => {};

describe("PhotoControl test suite", () => {
  test("even number of photos", () => {
    const photos: Photo[] = [
      { uri: "", size: 128, height: 16, width: 24 },
      { uri: "", size: 256, height: 24, width: 16 },
    ];

    const { toJSON } = render(
      <PhotoControl
        navigation={navigation}
        photos={photos}
        onUpdatePhotos={() => {}}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test("odd number of photos", () => {
    const photos: Photo[] = [{ uri: "", size: 1024, height: 16, width: 24 }];

    const { toJSON } = render(
      <PhotoControl
        navigation={navigation}
        photos={photos}
        onUpdatePhotos={() => {}}
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
