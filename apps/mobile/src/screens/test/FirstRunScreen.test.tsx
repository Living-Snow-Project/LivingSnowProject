import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";
import { FirstRunScreenNavigationProp } from "../../navigation/Routes";
import FirstRunScreen from "../FirstRunScreen";

test("validates Welcome Screen navigation", () => {
  const navigation: FirstRunScreenNavigationProp =
    {} as FirstRunScreenNavigationProp;
  navigation.navigate = jest.fn();

  const { getByText, toJSON } = render(
    <NativeBaseProviderForTesting>
      <FirstRunScreen navigation={navigation} />
    </NativeBaseProviderForTesting>
  );
  fireEvent.press(getByText("Let's get started!"));
  expect(navigation.navigate).toBeCalledWith("Timeline");
  expect(toJSON()).toMatchSnapshot();
});
