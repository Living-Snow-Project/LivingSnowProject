import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
} from "react-native";
import PropTypes from "prop-types";
import * as Location from "expo-location";
import { formInputStyles } from "../../styles/FormInput";

const GpsCoordinatesInput = ({ setGpsCoordinates, onSubmitEditing }) => {
  const watchPosition = useRef(null);
  const gpsCoordinatesRef = useRef(null);
  const [gpsCoordinateString, setGpsCoordinateString] = useState(null);
  const [manualGpsCoordinates, setManualGpsCoordinates] = useState(false);
  // TextInput behaves differently on iOS and Android, detailed explaination in rendering of component
  const [gpsCoordinatesEditable, setGpsCoordinatesEditable] = useState(
    Platform.OS === "ios" ? true : false
  );

  // location subscription
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log(
          "Permission to access foreground location was denied: ${status}"
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
        console.log(
          `Location.watchPositionAsync() failed: ${JSON.stringify(error)}`
        );
      }
    })();

    return stopGps;
  }, []);

  const enableManualGpsCoordinates = () => {
    stopGps();

    // reset coordinate string, tell component user will enter coordinates, make the coordinate input editable, set focus
    updateGpsCoordinateString("");
    setManualGpsCoordinates(true);
    setGpsCoordinatesEditable(true);
    gpsCoordinatesRef.current.focus();
  };

  const clipCoordinate = (coordinate) =>
    JSON.stringify(coordinate.toFixed(6)).replace('"', "").replace('"', "");

  // accepts inputs from both location subscription and typed user input
  const updateGpsCoordinateString = (value) => {
    setGpsCoordinateString(value);

    // some users are adding parenthesis when manually entering coordinates, and we don't want them in the data set, quietly remove
    value = value.replace(`(`, ``).replace(`)`, ``);

    let latitude = undefined;
    let longitude = undefined;
    const coordinates = value.split(",");

    if (coordinates[0]) {
      latitude = coordinates[0].trim();
    }

    if (coordinates[1]) {
      longitude = coordinates[1].trim();
    }

    setGpsCoordinates(latitude, longitude);
  };

  const confirmManualGpsCoordinates = () => {
    if (global.appConfig.showGpsWarning && !manualGpsCoordinates) {
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

  const stopGps = () => {
    if (watchPosition.current) {
      watchPosition.current.remove();
      watchPosition.current = null;
    }
  };

  const gpsFieldProps = {
    style: formInputStyles.optionInputText,
    defaultValue: gpsCoordinateString,
    onChangeText: (value) => updateGpsCoordinateString(value),
    onSubmitEditing: () => onSubmitEditing(),
    ref: gpsCoordinatesRef,
    maxLength: 30,
    returnKeyType: "done",
    editable: gpsCoordinatesEditable,
  };

  return (
    <>
      {/* on iOS, TextInput captures input over parent TouchableHighlight and focus can be kept off even if editable = true.
      on Android, onTouchStart does nothing (can't make it editable through onTouchStart) and focus can't be kept off
      So use TouchableHighlight on Android for allowing manual GPS coordinates and TextInput on iOS. */}
      <Text style={formInputStyles.optionStaticText}>
        GPS Coordinates (latitude, longitude)
      </Text>
      {Platform.OS === "ios" && (
        <TextInput
          {...gpsFieldProps}
          onTouchStart={() => confirmManualGpsCoordinates()}
        />
      )}

      {Platform.OS === "android" && (
        <TouchableHighlight onPress={() => confirmManualGpsCoordinates()}>
          <TextInput {...gpsFieldProps} />
        </TouchableHighlight>
      )}
    </>
  );
};

GpsCoordinatesInput.propTypes = {
  setGpsCoordinates: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func.isRequired,
};

export default GpsCoordinatesInput;
