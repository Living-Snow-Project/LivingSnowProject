import React from "react";
import { render } from "@testing-library/react-native";
import PhotoControl from "../PhotoControl";

const navigation = {
  navigate: () => {},
  goBack: () => {},
};

describe("PhotoControl test suite", () => {
  test("even number of photos", () => {
    const photos = [
      { uri: "", height: 16, width: 24 },
      { uri: "", height: 24, width: 16 },
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
    const photos = [{ uri: "", height: 16, width: 24 }];

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
