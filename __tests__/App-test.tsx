import * as React from "react";
import { act, create } from "react-test-renderer";

/* eslint-disable import/extensions */
import App from "../App";

test(`App renders correctly`, async () => {
  let tree;
  // act is used to prevent snapshot returning null
  await act(async () => {
    tree = await create(<App />);
  });
  expect(tree.toJSON()).toMatchSnapshot();
});
