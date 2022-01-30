import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  View,
} from "react-native";
import PropTypes from "prop-types";
import * as Location from "expo-location";
import { formInputStyles } from "../../styles/FormInput";
import Logger from "../../lib/Logger";
import { getAppSettings } from "../../../AppSettings";
import TestIds from "../../constants/TestIds";
import Placeholders from "../../constants/Strings";

function GpsCoordinatesInput({ setGpsCoordinates, onSubmitEditing }) {
  const watchPosition = useRef<null | { remove(): void }>(null);
  const gpsCoordinatesRef = useRef<TextInput>(null);
  const [placeholderText, setPlaceholderText] = useState(
    Placeholders.GPS.AcquiringLocation
  );
  const [gpsCoordinateString, setGpsCoordinateString] = useState<string>(``);
  const [manualGpsCoordinates, setManualGpsCoordinates] = useState(false);
  const { showGpsWarning } = getAppSettings();
  const clipCoordinate = (coordinate) =>
    JSON.stringify(coordinate.toFixed(6)).replace('"', "").replace('"', "");

  // accepts inputs from both location subscription and typed user input
  const updateGpsCoordinateString = (value) => {
    setGpsCoordinateString(value);

    // some users are adding parenthesis when manually entering coordinates
    // we don't want them in the data set so quietly remove
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
      watchPosition.current?.remove();
      watchPosition.current = null;
    }
  };

  // location subscription
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setManualGpsCoordinates(true);
        setPlaceholderText(Placeholders.GPS.NoPermissions);
        Logger.Warn(`Permission to access foreground location was ${status}.`);
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
        setManualGpsCoordinates(true);
        setPlaceholderText(Placeholders.GPS.NoLocation);
        Logger.Error(`Location.watchPositionAsync() failed: ${error}`);
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

GpsCoordinatesInput.propTypes = {
  setGpsCoordinates: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
};

export default GpsCoordinatesInput;
