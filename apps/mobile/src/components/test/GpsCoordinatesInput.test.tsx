import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";
import { GpsCoordinatesInput } from "../forms/GpsCoordinatesInput";
import { Placeholders } from "../../constants/Strings";

describe("GpsCoordinatesInput tests", () => {
  const onSubmitEditingMock = jest.fn();
  const setGpsCoordinatesMock = jest.fn();

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

        const sub: Location.LocationSubscription = {
          remove() {},
        };

        return Promise.resolve<Location.LocationSubscription>(sub);
      });

  const renderGpsCoordinatesInput = () =>
    render(
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditingMock}
        setGpsCoordinates={setGpsCoordinatesMock}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders", async () => {
    watchPositionAsyncSuccessMock();
    requestForegroundPermissionsAsyncSuccessMock();

    const { getByDisplayValue, toJSON } = renderGpsCoordinatesInput();

    await waitFor(() => getByDisplayValue("123.456000, -98.765000"));
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
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditingMock}
        setGpsCoordinates={setGpsCoordinatesMock}
      />
    );

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));

    fireEvent.changeText(
      getByPlaceholderText(Placeholders.GPS.NoPermissions),
      "(56.789  , 454.76)   "
    );

    expect(setGpsCoordinatesMock).toBeCalledWith(56.789, 454.76);
  });

  test("done editing", async () => {
    requestForegroundPermissionsAsyncFailureMock();

    const { getByPlaceholderText } = render(
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditingMock}
        setGpsCoordinates={setGpsCoordinatesMock}
      />
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
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditingMock}
        setGpsCoordinates={setGpsCoordinatesMock}
        coordinates={coordinates}
      />
    );

    await waitFor(() =>
      getByDisplayValue(`${coordinates.latitude}, ${coordinates.longitude}`)
    );

    expect(foregroundPermissionMock).not.toBeCalled();
  });
});
