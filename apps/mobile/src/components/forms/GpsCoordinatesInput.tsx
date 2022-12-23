import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import Logger from "@livingsnow/logger";
import { formInputStyles } from "../../styles/FormInput";
import { getAppSettings } from "../../../AppSettings";
import { TestIds } from "../../constants/TestIds";
import { Placeholders } from "../../constants/Strings";

type GpsCoordinates = {
  latitude: number;
  longitude: number;
};

type GpsCoordinatesInputProps = {
  setGpsCoordinates: (latitude: number, longitude: number) => void;
  onSubmitEditing: () => void;
  coordinates?: GpsCoordinates;
};

export function GpsCoordinatesInput({
  setGpsCoordinates,
  onSubmitEditing,
  coordinates = { latitude: 0, longitude: 0 },
}: GpsCoordinatesInputProps) {
  const watchPosition = useRef<null | { remove(): void }>(null);
  const gpsCoordinatesRef = useRef<TextInput>(null);
  const [placeholderText, setPlaceholderText] = useState(
    Placeholders.GPS.AcquiringLocation
  );
  const useGps = coordinates.latitude === 0 && coordinates.longitude === 0;
  const [gpsCoordinateString, setGpsCoordinateString] = useState<string>(
    useGps ? `` : `${coordinates.latitude}, ${coordinates.longitude}`
  );
  const [manualGpsCoordinates, setManualGpsCoordinates] = useState(!useGps);
  const showGpsWarning = useGps ? getAppSettings().showGpsWarning : false;
  const clipCoordinate = (coordinate: number) =>
    JSON.stringify(coordinate.toFixed(6)).replace('"', "").replace('"', "");

  // accepts inputs from both location subscription and typed user input
  const updateGpsCoordinateString = (value: string) => {
    setGpsCoordinateString(value);

    // some users are adding parenthesis when manually entering coordinates
    // we don't want them in the data set so quietly remove
    const coords = value.replace(`(`, ``).replace(`)`, ``).split(",");

    let latitude;
    let longitude;

    if (coords[0]) {
      latitude = Number(coords[0].trim());
    }

    if (coords[1]) {
      longitude = Number(coords[1].trim());
    }

    setGpsCoordinates(latitude, longitude);
  };

  const stopGps = () => {
    if (watchPosition.current) {
      watchPosition.current?.remove();
      watchPosition.current = null;
    }
  };

  // location subscription
  useEffect(() => {
    if (!useGps) return () => {};

    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setManualGpsCoordinates(true);
        setPlaceholderText(Placeholders.GPS.NoPermissions);
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
            updateGpsCoordinateString(
              `${clipCoordinate(coords.latitude)}, ${clipCoordinate(
                coords.longitude
              )}`
            )
        );
      } catch (error) {
        setManualGpsCoordinates(true);
        setPlaceholderText(Placeholders.GPS.NoLocation);
        Logger.Error(`Location.watchPositionAsync() failed: ${error}`);
      }
    })();

    return stopGps;
  }, []);

  useEffect(() => {
    if (useGps) {
      gpsCoordinatesRef?.current?.focus();
    }
  }, [manualGpsCoordinates]);

  const enableManualGpsCoordinates = () => {
    stopGps();
    updateGpsCoordinateString("");
    setManualGpsCoordinates(true);
    setPlaceholderText(Placeholders.GPS.EnterCoordinates);
  };

  const confirmManualGpsCoordinates = () => {
    if (showGpsWarning) {
      Alert.alert(
        "Enter GPS coordinates manually?",
        "This message can be disabled in Settings.",
        [
          {
            text: "Yes",
            onPress: () => enableManualGpsCoordinates(),
          },
          {
            text: "No",
            style: "cancel",
          },
        ]
      );
    } else {
      enableManualGpsCoordinates();
    }
  };

  const gpsFieldProps = {
    style: formInputStyles.optionInputText,
    editable: manualGpsCoordinates,
    maxLength: 30,
    placeholder: placeholderText,
    defaultValue: gpsCoordinateString,
    returnKeyType: "done" as ReturnKeyTypeOptions,
  };

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        GPS Coordinates (latitude, longitude)
      </Text>
      {!manualGpsCoordinates && (
        /* user confirms they want to enter GPS coordinates manually */
        <Pressable
          onPress={() => confirmManualGpsCoordinates()}
          testID={TestIds.GPS.gpsManualPressableTestId}
        >
          <View pointerEvents="none">
            <TextInput {...gpsFieldProps} />
          </View>
        </Pressable>
      )}
      {manualGpsCoordinates && (
        <TextInput
          {...gpsFieldProps}
          testID={TestIds.GPS.gpsManualInputTestId}
          onChangeText={(value) => updateGpsCoordinateString(value)}
          onSubmitEditing={() => onSubmitEditing()}
          ref={gpsCoordinatesRef}
        />
      )}
    </>
  );
}
