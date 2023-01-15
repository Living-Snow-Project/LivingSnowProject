import React, { useEffect, useReducer, useRef } from "react";
import { Pressable, View } from "native-base";
import {
  Accuracy,
  LocationSubscription,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import Logger from "@livingsnow/logger";
import { CustomTextInput } from "./CustomTextInput";
import { Modal } from "../Modal";
import { getAppSettings } from "../../../AppSettings";
import { Labels, Placeholders, TestIds, Validations } from "../../constants";

export type GpsCoordinates = {
  latitude: number | undefined;
  longitude: number | undefined;
};

type GpsState = {
  value: string;
  placeholder: string;
  isConfirmManualEntryOpen: boolean;
  usingManualEntry: boolean; // edit mode or during record creation
};

const createInitialGpsState = ({
  coordinates,
  usingGps,
}: {
  coordinates: GpsCoordinates;
  usingGps: boolean;
}): GpsState => {
  const value =
    coordinates.latitude && coordinates.longitude
      ? `${coordinates.latitude}, ${coordinates.longitude}`
      : ``;

  return {
    value,
    placeholder: Placeholders.GPS.AcquiringLocation,
    isConfirmManualEntryOpen: false,
    usingManualEntry: !usingGps,
  };
};

type GpsAction =
  | { type: "UPDATE"; displayValue: string }
  | { type: "SWITCH_TO_MANUAL" }
  | { type: "NO_PERMISSION" }
  | { type: "ERROR_WATCHING_LOCATION" }
  | { type: "SHOW_CONFIRM_MANUAL" }
  | { type: "CLOSE_CONFIRM_MANUAL" };

function gpsCoordinatesReducer(current: GpsState, action: GpsAction): GpsState {
  switch (action.type) {
    case "UPDATE":
      return {
        ...current,
        value: action.displayValue,
      };

    case "SWITCH_TO_MANUAL":
      return {
        value: "",
        placeholder: Placeholders.GPS.EnterCoordinates,
        isConfirmManualEntryOpen: false,
        usingManualEntry: true,
      };

    case "NO_PERMISSION":
      return {
        ...current,
        placeholder: Placeholders.GPS.NoPermissions,
        usingManualEntry: true,
      };

    case "ERROR_WATCHING_LOCATION":
      return {
        ...current,
        placeholder: Placeholders.GPS.NoLocation,
        usingManualEntry: true,
      };

    case "SHOW_CONFIRM_MANUAL":
      return {
        ...current,
        isConfirmManualEntryOpen: true,
      };

    case "CLOSE_CONFIRM_MANUAL":
      return {
        ...current,
        isConfirmManualEntryOpen: false,
      };

    default:
      throw new Error("Unexpected action type in Gps Coordinate reducer");
  }
}

// Gaia GPS and CalTopo both use 5 decimal places
const precision = 5;

type GpsCoordinatesInputProps = {
  coordinates: GpsCoordinates;
  usingGps: boolean;
  isInvalid: boolean;
  setCoordinates: (coordinates: GpsCoordinates) => void;
  onSubmitEditing: () => void;
};

export function GpsCoordinatesInput({
  coordinates,
  usingGps,
  isInvalid,
  setCoordinates,
  onSubmitEditing,
}: GpsCoordinatesInputProps) {
  const watchPosition = useRef<LocationSubscription | null>(null);
  const coordinatesInputRef = useRef<any>(null);
  const [state, dispatch] = useReducer(
    gpsCoordinatesReducer,
    { coordinates, usingGps },
    createInitialGpsState
  );

  const showGpsWarning = usingGps && getAppSettings().showGpsWarning;

  const clipCoordinate = (coordinate: number) =>
    Number(coordinate.toFixed(precision));

  // watch location callback
  const onCoordinatesWatch = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    const lat = clipCoordinate(latitude);
    const long = clipCoordinate(longitude);

    dispatch({ type: "UPDATE", displayValue: `${lat}, ${long}` });
    setCoordinates({ latitude: lat, longitude: long });
  };

  // typed user input
  const onCoordinatesChanged = (value: string) => {
    // some users add parenthesis when manually entering
    const coords = value.replace(`(`, ``).replace(`)`, ``).split(",");

    const latitude = coords[0]
      ? Number(Number(coords[0].trim()).toFixed(precision))
      : undefined;
    const longitude = coords[1]
      ? Number(Number(coords[1].trim()).toFixed(precision))
      : undefined;

    dispatch({ type: "UPDATE", displayValue: value });
    setCoordinates({ latitude, longitude });
  };

  const stopWatchPosition = () => {
    watchPosition.current?.remove();
    watchPosition.current = null;
  };

  // location subscription
  useEffect(() => {
    if (!usingGps) {
      return () => {};
    }

    (async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status != "granted") {
        dispatch({ type: "NO_PERMISSION" });
        Logger.Warn(`Permission to access foreground location was ${status}.`);
        return;
      }

      try {
        watchPosition.current = await watchPositionAsync(
          {
            accuracy: Accuracy.High,
            timeInterval: 5000,
          },
          ({ coords }) =>
            onCoordinatesWatch({
              latitude: coords.latitude,
              longitude: coords.longitude,
            })
        );
      } catch (error) {
        dispatch({ type: "ERROR_WATCHING_LOCATION" });
        Logger.Error(`Location.watchPositionAsync() failed: ${error}`);
      }
    })();

    return stopWatchPosition;
    // only subscribe to the location subscription on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enableManualEntry = () => {
    stopWatchPosition();
    coordinatesInputRef.current.focus();
    dispatch({ type: "SWITCH_TO_MANUAL" });
  };

  const showConfirmManualEntry = () => {
    if (showGpsWarning) {
      dispatch({ type: "SHOW_CONFIRM_MANUAL" });
    } else {
      // user knows what they are doing and doesn't want to be prompted
      enableManualEntry();
    }
  };

  const dismissConfirmManualEntry = () =>
    dispatch({ type: "CLOSE_CONFIRM_MANUAL" });

  const renderCoordinatesInput = (
    // user confirms they want to enter GPS coordinates manually
    <Pressable
      onPress={showConfirmManualEntry}
      testID={TestIds.GPS.GpsManualEntryPressable}
    >
      <View pointerEvents={state.usingManualEntry ? "auto" : "none"}>
        <CustomTextInput
          label={Labels.RecordScreen.Gps}
          placeholder={state.placeholder}
          value={state.value}
          isRequired
          isInvalid={isInvalid}
          validation={Validations.invalidCoordinates}
          maxLength={30}
          onChangeText={onCoordinatesChanged}
          onSubmitEditing={onSubmitEditing}
          ref={coordinatesInputRef}
        />
      </View>
    </Pressable>
  );

  return (
    <>
      <Modal
        header={Labels.Modal.GpsManualEntry.header}
        body={Labels.Modal.GpsManualEntry.body}
        isOpen={state.isConfirmManualEntryOpen}
        testId={TestIds.GPS.GpsManualEntryModal}
        setIsOpen={dismissConfirmManualEntry}
        onConfirm={enableManualEntry}
      />
      {renderCoordinatesInput}
    </>
  );
}
