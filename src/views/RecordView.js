import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Touchable from "react-native-platform-touchable";
import PropTypes from "prop-types";
import KeyboardShift from "../components/KeyboardShift";
import { Storage } from "../lib/Storage";
import { RecordManager } from "../lib/RecordManager";
import { StockIcon } from "../components/TabBarIcon";
import { formInputStyles } from "../styles/FormInput";
import { AtlasTypes } from "../lib/Atlas";
import { TypeSelector } from "../components/forms/TypeSelector";
import { DateSelector } from "../components/forms/DateSelector";
import { CustomTextInput } from "../components/forms/CustomTextInput";
import { GpsCoordinatesInput } from "../components/forms/GpsCoordinatesInput";
import { AtlasSelector } from "../components/forms/AtlasSelector";
import { PhotoControl } from "../components/PhotoControl";

export const RecordView = ({ navigation }) => {
  const notesRef = useRef(null);
  const locationDescriptionRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // TODO: encapsulated Record object
  // data collected and sent to the service
  const [state, setState] = useState({
    recordType: "Sample", // sample or sighting
    date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD
    latitude: undefined, // GPS
    longitude: undefined, // GPS
    tubeId: undefined, // (optional) id of the tube
    locationDescription: undefined, // (optional) short description of the location
    notes: undefined, // (optional) any other pertinent information
    atlasType: AtlasTypes.Undefined, // (optional)
    photos: [], // (optional)
  });

  // data fetching side effect when "upload record" icon tapped
  useEffect(() => {
    // effect executes when uploading is desired
    if (!uploading) {
      return;
    }

    if (!validateUserInput()) {
      setUploading(false);
      return;
    }

    // TODO: encapsulated Record object
    const record = {
      type: state.recordType,
      name: global.appConfig.name,
      date: state.date,
      organization: global.appConfig.organization,
      latitude: state.latitude,
      longitude: state.longitude,
      tubeId: state.tubeId,
      locationDescription: state.locationDescription,
      notes: state.notes,
      atlasType: state.recordType.includes(`Atlas`)
        ? state.atlasType
        : AtlasTypes.Undefined,
    };

    RecordManager.uploadRecord(record, state.photos)
      .then(() => {
        Alert.alert(`Upload succeeded`, `Thanks for your submission.`);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(`Record Saved`, `We will upload it later.`);
      })
      .finally(() => {
        setUploading(false);
        navigation.goBack();
      });
  }, [uploading]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: function UploadRecord() {
        return (
          <Touchable onPress={() => setUploading(true)}>
            <StockIcon
              name={
                Platform.OS === "ios" ? "ios-cloud-upload" : "md-cloud-upload"
              }
            />
          </Touchable>
        );
      },
      headerRightContainerStyle: { marginRight: 20 },
    });
  }, []);

  // user input form validation
  const validateUserInput = () => {
    // TODO: this should be done on FirstRun and\or Settings
    if (!global.appConfig.name || global.appConfig.name === ``) {
      global.appConfig.name = `Anonymous`;
      Storage.saveAppConfig();
    }

    const isNumber = (value) => !isNaN(Number(value));

    if (
      !state.latitude ||
      !state.longitude ||
      !isNumber(state.latitude) ||
      !isNumber(state.longitude)
    ) {
      Alert.alert(
        `Invalid GPS coordinates`,
        `Coordinates must be in "lat, long" format. ie. 12.345678, -123.456789`,
        [
          {
            text: `Ok`,
          },
        ]
      );

      return false;
    }

    return true;
  };

  return (
    <KeyboardShift>
      {() => (
        <ScrollView style={formInputStyles.container}>
          {uploading && (
            <View style={{ marginTop: 3 }}>
              <ActivityIndicator
                animating={uploading}
                size={"large"}
                color="#0000ff"
              />
            </View>
          )}

          {/* Sample, Sighting, Atlas, etc */}
          <TypeSelector
            recordType={state.recordType}
            setRecordType={(recordType) =>
              setState((prev) => ({ ...prev, recordType }))
            }
          />

          {/* Date of Sample, Sighting, Atlas, etc */}
          <DateSelector
            date={state.date}
            setDate={(date) => setState((prev) => ({ ...prev, date }))}
          />

          {/* Tube Id: only show Tube Id when recording a Sample */}
          {state.recordType.includes(`Sample`) && (
            <CustomTextInput
              description={`Tube Id`}
              placeholder={`Leave blank if the tube does not have an id`}
              maxLength={20}
              onChangeText={(tubeId) =>
                setState((prev) => ({ ...prev, tubeId }))
              }
              onSubmitEditing={() => locationDescriptionRef.current.focus()}
            />
          )}

          <GpsCoordinatesInput
            setGpsCoordinates={(latitude, longitude) =>
              setState((prev) => ({ ...prev, latitude, longitude }))
            }
            onSubmitEditing={() => locationDescriptionRef.current.focus()}
          />

          <AtlasSelector
            recordType={state.recordType}
            atlasType={state.atlasType}
            setAtlasType={(atlasType) =>
              setState((prev) => ({ ...prev, atlasType }))
            }
          />

          <CustomTextInput
            description={`Location Description (limit 255 characters)`}
            placeholder={`ie: Blue Lake, North Cascades, WA`}
            onChangeText={(locationDescription) =>
              setState((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current.focus()}
            ref={locationDescriptionRef}
          />

          <CustomTextInput
            description={`Additional Notes (limit 255 characters)`}
            placeholder={`ie. algae growing on glacial ice`}
            onChangeText={(notes) => setState((prev) => ({ ...prev, notes }))}
            ref={notesRef}
          />

          <PhotoControl
            navigation={navigation}
            photos={state.photos}
            onUpdatePhotos={(photos) =>
              setState((prev) => ({ ...prev, photos }))
            }
          />
        </ScrollView>
      )}
    </KeyboardShift>
  );
};

RecordView.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};
