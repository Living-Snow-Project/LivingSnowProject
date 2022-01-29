import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";
import GpsCoordinatesInput from "../forms/GpsCoordinatesInput";
import Placeholders from "../../constants/Strings";

const requestForegroundPermissionsAsyncSuccessMock = () =>
  jest
    .spyOn(Location, "requestForegroundPermissionsAsync")
    .mockImplementation(() =>
      Promise.resolve({
        status: "granted",
      } as Location.LocationPermissionResponse)
    );

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

describe("GpsCoordinatesInput tests", () => {
  const onSubmitEditing = jest.fn();
  const setGpsCoordinates = jest.fn();

  const requestForegroundPermissionsAsyncFailureMock = () => {
    jest
      .spyOn(Location, "requestForegroundPermissionsAsync")
      .mockImplementation(() =>
        Promise.resolve({
          status: "denied",
        } as Location.LocationPermissionResponse)
      );
  };

  const renderGpsCoordinatesInput = () =>
    render(
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditing}
        setGpsCoordinates={setGpsCoordinates}
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

    const setCoordinates = jest.fn();
    const { getByPlaceholderText } = render(
      <GpsCoordinatesInput
        onSubmitEditing={onSubmitEditing}
        setGpsCoordinates={setCoordinates}
      />
    );

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));

    fireEvent.changeText(
      getByPlaceholderText(Placeholders.GPS.NoPermissions),
      "(56.789  , 454.76)   "
    );

    expect(setCoordinates).toBeCalledWith("56.789", "454.76");
  });

  test("done editing", async () => {
    requestForegroundPermissionsAsyncFailureMock();

    const submitEditing = jest.fn();
    const { getByPlaceholderText } = render(
      <GpsCoordinatesInput
        onSubmitEditing={submitEditing}
        setGpsCoordinates={setGpsCoordinates}
      />
    );

    await waitFor(() => getByPlaceholderText(Placeholders.GPS.NoPermissions));
    fireEvent(
      getByPlaceholderText(Placeholders.GPS.NoPermissions),
      "onSubmitEditing"
    );
    expect(submitEditing).toHaveBeenCalled();
  });
});
