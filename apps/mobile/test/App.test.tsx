import * as React from "react";
import { preventAutoHideAsync } from "expo-splash-screen";
import { act, create } from "react-test-renderer";
/* eslint-disable import/extensions */
import { App } from "../App";

jest.mock("expo-splash-screen", () => {
  const actual = jest.requireActual("expo-splash-screen");
  return {
    ...actual,
    preventAutoHideAsync: jest.fn().mockReturnValue(Promise.resolve()),
  };
});

describe("App test suite", () => {
  test(`renders`, async () => {
    let tree;
    // act is used to prevent snapshot returning null
    // act is responsible for flushing all effects and rerenders after invoking it.
    await act(async () => {
      tree = await create(<App />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test("renders if SplashScreen has a failure", async () => {
    // @ts-ignore
    preventAutoHideAsync.mockImplementation(() => {
      const success = false;
      return Promise.reject(success);
    });

    let tree;
    await act(async () => {
      tree = await create(<App />);
    });

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
