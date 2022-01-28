import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import PropTypes from "prop-types";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import KeyboardShift from "../components/KeyboardShift";
import RecordManager from "../lib/RecordManager";
import Logger from "../lib/Logger";
import { formInputStyles } from "../styles/FormInput";
import HeaderButton from "../components/HeaderButton";
import { AtlasType } from "../record/Atlas";
import TypeSelector from "../components/forms/TypeSelector";
import DateSelector from "../components/forms/DateSelector";
import CustomTextInput from "../components/forms/CustomTextInput";
import { GpsCoordinatesInput } from "../components/forms/GpsCoordinatesInput";
import AtlasSelector from "../components/forms/AtlasSelector";
import PhotoControl from "../components/PhotoControl";
import * as Record from "../record/Record";
import { getAppSettings } from "../../AppSettings";

export default function RecordScreen({ navigation }) {
  const notesRef = useRef<TextInput>(null);
  const locationDescriptionRef = useRef<TextInput>(null);
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const appSettings = getAppSettings();

  // data collected and sent to the service
  const [state, setState] = useState<Record.Record>({
    id: `0`,
    type: Record.RecordType.Sample, // sample or sighting
    date: new Date(), // YYYY-MM-DD
    latitude: undefined, // GPS
    longitude: undefined, // GPS
    atlasType: AtlasType.SnowAlgae, // (optional)
  });

  const [photos, setPhotos] = useState([]);

  // user input form validation
  const validateUserInput = () => {
    const isNumber = (value) => !Number.isNaN(Number(value));

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

  const UploadRecord = useCallback(
    () => (
      <HeaderButton
        onPress={() => setUploading(true)}
        iconName="cloud-upload"
        placement="right"
      />
    ),
    []
  );

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

    // TODO: construct from Record object
    const record = {
      id: uuidv4(),
      type: Record.translateToLegacyRecordType(state.type),
      name: appSettings.name ? appSettings.name : "Anonymous",
      date: new Date(date),
      organization: !appSettings.organization
        ? undefined
        : appSettings.organization,
      latitude: state.latitude,
      longitude: state.longitude,
      tubeId: state.tubeId,
      locationDescription: state.locationDescription,
      notes: state.notes,
      atlasType: Record.isAtlas(state.type)
        ? state.atlasType
        : AtlasType.Undefined,
    };

    RecordManager.uploadRecord(record, photos)
      .then(() => {
        Alert.alert(`Upload succeeded`, `Thanks for your submission.`);
      })
      .catch((error) => {
        Logger.Warn(JSON.stringify(error));
        Alert.alert(`Record Saved`, `We will upload it later.`);
      })
      .finally(() => {
        setUploading(false);
        navigation.goBack();
      });
  }, [uploading]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => UploadRecord(),
    });
  }, []);

  return (
    <KeyboardShift>
      {() => (
        <ScrollView style={formInputStyles.container}>
          {uploading && (
            <View style={{ marginTop: 3 }}>
              <ActivityIndicator
                animating={uploading}
                size="large"
                color="#0000ff"
              />
            </View>
          )}

          {/* Sample, Sighting, Atlas, etc */}
          <TypeSelector
            type={state.type}
            setType={(type) => setState((prev) => ({ ...prev, type }))}
          />

          {/* Date of Sample, Sighting, Atlas, etc */}
          <DateSelector date={date} setDate={(newDate) => setDate(newDate)} />

          {/* Tube Id: only show Tube Id when recording a Sample */}
          {Record.isSample(state.type) && (
            <CustomTextInput
              description="Tube Id"
              placeholder="Leave blank if the tube does not have an id"
              maxLength={20}
              onChangeText={(tubeId) =>
                setState((prev) => ({ ...prev, tubeId }))
              }
              onSubmitEditing={() => locationDescriptionRef.current?.focus()}
            />
          )}

          <GpsCoordinatesInput
            setGpsCoordinates={(latitude, longitude) =>
              setState((prev) => ({ ...prev, latitude, longitude }))
            }
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
          />

          <AtlasSelector
            recordType={state.type}
            atlasType={state.atlasType}
            setAtlasType={(atlasType) =>
              setState((prev) => ({ ...prev, atlasType }))
            }
          />

          <CustomTextInput
            description="Location Description (limit 255 characters)"
            placeholder="ie: Blue Lake, North Cascades, WA"
            onChangeText={(locationDescription) =>
              setState((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current?.focus()}
            ref={locationDescriptionRef}
          />

          <CustomTextInput
            description="Additional Notes (limit 255 characters)"
            placeholder="ie. algae growing on glacial ice"
            onChangeText={(notes) => setState((prev) => ({ ...prev, notes }))}
            ref={notesRef}
          />

          <PhotoControl
            navigation={navigation}
            photos={photos}
            onUpdatePhotos={(newPhotos) => setPhotos(newPhotos)}
          />
        </ScrollView>
      )}
    </KeyboardShift>
  );
}

RecordScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};
