import * as React from 'react';
import { act, create } from 'react-test-renderer';

import App from '../App';

jest.mock('expo', () => ({
  Linking: {
    makeUrl: () => '/',
  },
  SplashScreen: {
    preventAutoHide: () => 'preventAutoHide',
    hide: () => 'hide',
  },
}));

describe('App', () => {
  jest.useFakeTimers();

  let tree;
  it(`renders correctly`, async () => {
    // act is used to prevent snapshot returning null
    await act(async () => {
      tree = await create(<App />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
