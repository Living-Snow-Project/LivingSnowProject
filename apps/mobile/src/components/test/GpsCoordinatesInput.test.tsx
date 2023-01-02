import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";
import { GpsCoordinatesInput } from "../forms/GpsCoordinatesInput";
import { Placeholders } from "../../constants";
import { NativeBaseProviderForTesting } from "../../../jesttest.setup";

describe("GpsCoordinatesInput tests", () => {
  const onSubmitEditingMock = jest.fn();
  const setCoordinatesMock = jest.fn();

  const requestForegroundPermissionsAsyncMock = (result: string) =>
    jest
      .spyOn(Location, "requestForegroundPermissionsAsync")
      .mockImplementation(() =>
        Promise.resolve({
          status: result,
        } as Location.LocationPermissionResponse)
      );

  const requestForegroundPermissionsAsyncSuccessMock = () =>
    requestForegroundPermissionsAsyncMock("granted");

  const requestForegroundPermissionsAsyncFailureMock = () =>
    requestForegroundPermissionsAsyncMock("denied");

  const watchPositionAsyncSuccessMock = () =>
    jest
      .spyOn(Location, "watchPositionAsync")
      .mockImplementation((options, callback) => {
        const location = {
          coords: {
            latitude: 123.456,
            longitude: -98.765,
          },
        };

        callback(location as Location.LocationObject);

        const unsub: Location.LocationSubscription = {
          remove() {},
        };

        return Promise.resolve<Location.LocationSubscription>(unsub);
      });

  const renderGpsCoordinatesInput = () =>
    render(
      <NativeBaseProviderForTesting>
        <GpsCoordinatesInput
          coordinates={{ latitude: undefined, longitude: undefined }}
          usingGps
          onSubmitEditing={onSubmitEditingMock}
          setCoordinates={setCoordinatesMock}
        />
      </NativeBaseProviderForTesting>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders", async () => {
    watchPositionAsyncSuccessMock();
    requestForegroundPermissionsAsyncSuccessMock();

    const { getByDisplayValue, toJSON } = renderGpsCoordinatesInput();

    await waitFor(() => getByDisplayValue("123.456, -98.765"));
    expect(toJSON()).toMatchSnapshot();
  });

  test("permission denied", async () => {
    requestForegroundPermissionsAsyncFailureMock();

    const { getByPlaceholderText } = renderGpsCoordinatesInput();

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));
  });

  test("failure to watchPositionAsync", async () => {
    jest
      .spyOn(Location, "watchPositionAsync")
      .mockImplementation(() => Promise.reject(Error("mock failure")));

    requestForegroundPermissionsAsyncSuccessMock();

    const { getByPlaceholderText } = renderGpsCoordinatesInput();

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoLocation));
  });

  test("extra parenthesis and spaces are clipped", async () => {
    requestForegroundPermissionsAsyncFailureMock();

    const { getByPlaceholderText } = render(
      <NativeBaseProviderForTesting>
        <GpsCoordinatesInput
          coordinates={{ latitude: undefined, longitude: undefined }}
          usingGps
          onSubmitEditing={onSubmitEditingMock}
          setCoordinates={setCoordinatesMock}
        />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));

    fireEvent.changeText(
      getByPlaceholderText(Placeholders.GPS.NoPermissions),
      "(56.789  , 454.76)   "
    );

    expect(setCoordinatesMock).toBeCalledWith({
      latitude: 56.789,
      longitude: 454.76,
    });
  });

  test("done editing", async () => {
    requestForegroundPermissionsAsyncFailureMock();

    const { getByPlaceholderText } = render(
      <NativeBaseProviderForTesting>
        <GpsCoordinatesInput
          coordinates={{ latitude: undefined, longitude: undefined }}
          usingGps
          onSubmitEditing={onSubmitEditingMock}
          setCoordinates={setCoordinatesMock}
        />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));
    fireEvent(
      getByPlaceholderText(Placeholders.GPS.NoPermissions),
      "onSubmitEditing"
    );
    expect(onSubmitEditingMock).toHaveBeenCalled();
  });

  test("edit mode with existing coordinates", async () => {
    const foregroundPermissionMock =
      requestForegroundPermissionsAsyncSuccessMock();
    const coordinates = {
      latitude: 33.77112,
      longitude: -133.7331,
    };

    const { getByDisplayValue } = render(
      <NativeBaseProviderForTesting>
        <GpsCoordinatesInput
          coordinates={coordinates}
          usingGps={false}
          onSubmitEditing={onSubmitEditingMock}
          setCoordinates={setCoordinatesMock}
        />
      </NativeBaseProviderForTesting>
    );

    await waitFor(() =>
      getByDisplayValue(`${coordinates.latitude}, ${coordinates.longitude}`)
    );

    expect(foregroundPermissionMock).not.toBeCalled();
  });
});
