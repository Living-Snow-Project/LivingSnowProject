import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import PropTypes from "prop-types";
import * as Location from "expo-location";
import { formInputStyles } from "../../styles/FormInput";
import Logger from "../../lib/Logger";
import { getAppSettings } from "../../../AppSettings";

export default function GpsCoordinatesInput({
  setGpsCoordinates,
  onSubmitEditing,
}) {
  const watchPosition = useRef(null);
  const gpsCoordinatesRef = useRef(null);
  const [gpsCoordinateString, setGpsCoordinateString] = useState(null);
  const [manualGpsCoordinates, setManualGpsCoordinates] = useState(false);
  const { showGpsWarning } = getAppSettings();
  const clipCoordinate = (coordinate) =>
    JSON.stringify(coordinate.toFixed(6)).replace('"', "").replace('"', "");

  // accepts inputs from both location subscription and typed user input
  const updateGpsCoordinateString = (value) => {
    setGpsCoordinateString(value);

    // some users are adding parenthesis when manually entering coordinates, and we don't want them in the data set, quietly remove
    const coordinates = value.replace(`(`, ``).replace(`)`, ``).split(",");

    let latitude;
    let longitude;

    if (coordinates[0]) {
      latitude = coordinates[0].trim();
    }

    if (coordinates[1]) {
      longitude = coordinates[1].trim();
    }

    setGpsCoordinates(latitude, longitude);
  };

  const stopGps = () => {
    if (watchPosition.current) {
      watchPosition.current.remove();
      watchPosition.current = null;
    }
  };

  // location subscription
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Logger.Warn(
          `Permission to access foreground location was denied: ${status}`
        );
        return;
      }

      try {
        watchPosition.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
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
        Logger.Error(
          `Location.watchPositionAsync() failed: ${JSON.stringify(error)}`
        );
      }
    })();

    return stopGps;
  }, []);

  useEffect(() => {
    gpsCoordinatesRef?.current?.focus();
  }, [manualGpsCoordinates]);

  const enableManualGpsCoordinates = () => {
    stopGps();
    updateGpsCoordinateString("");
    setManualGpsCoordinates(true);
  };

  const confirmManualGpsCoordinates = () => {
    if (showGpsWarning && !manualGpsCoordinates) {
      Alert.alert(
        "Enter GPS coordinates manually?\nThis message can be disabled in Settings.",
        null,
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
    } else if (!manualGpsCoordinates) {
      enableManualGpsCoordinates();
    }
  };

  const gpsFieldProps = {
    style: formInputStyles.optionInputText,
    defaultValue: gpsCoordinateString,
    maxLength: 30,
    returnKeyType: "done",
    editable: manualGpsCoordinates,
  };

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        GPS Coordinates (latitude, longitude)
      </Text>
      {!manualGpsCoordinates && (
        /* user confirms they want to enter GPS coordinates manually */
        <Pressable onPress={() => confirmManualGpsCoordinates()}>
          <View pointerEvents="none">
            <TextInput {...gpsFieldProps} />
          </View>
        </Pressable>
      )}
      {manualGpsCoordinates && (
        <TextInput
          {...gpsFieldProps}
          onChangeText={(value) => updateGpsCoordinateString(value)}
          onSubmitEditing={() => onSubmitEditing()}
          ref={gpsCoordinatesRef}
        />
      )}
    </>
  );
}

GpsCoordinatesInput.propTypes = {
  setGpsCoordinates: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
};
