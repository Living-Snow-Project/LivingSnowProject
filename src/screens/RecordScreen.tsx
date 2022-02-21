import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { uploadRecord } from "../lib/RecordManager";
import Logger from "../lib/Logger";
import { formInputStyles } from "../styles/FormInput";
import HeaderButton from "../components/HeaderButton";
import { AtlasType } from "../record/Atlas";
import TypeSelector from "../components/forms/TypeSelector";
import DateSelector from "../components/forms/DateSelector";
import CustomTextInput from "../components/forms/CustomTextInput";
import GpsCoordinatesInput from "../components/forms/GpsCoordinatesInput";
import AtlasSelector from "../components/forms/AtlasSelector";
import PhotoControl from "../components/PhotoControl";
import {
  Record,
  RecordType,
  isAtlas,
  isSample,
  recordDateFormat,
} from "../record/Record";
import { getAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";
import { Labels, Notifications, Placeholders } from "../constants/Strings";

type OffsetOperation = "add" | "subtract";

const dateWithOffset = (date: Date, op: OffsetOperation): Date => {
  if (op === "add") {
    return new Date(
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    );
  }

  return new Date(
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  );
};

export default function RecordScreen({ navigation }) {
  const notesRef = useRef<TextInput>(null);
  const locationDescriptionRef = useRef<TextInput>(null);
  const [uploading, setUploading] = useState(false);
  const appSettings = getAppSettings();

  // data collected and sent to the service
  const [state, setState] = useState<Record>({
    id: uuidv4(),
    name: appSettings.name ? appSettings.name : "Anonymous",
    organization: !appSettings.organization
      ? undefined
      : appSettings.organization,
    type: RecordType.Sample, // sample or sighting
    date: dateWithOffset(new Date(), "subtract"), // YYYY-MM-DD
    latitude: 0, // GPS
    longitude: 0, // GPS
    atlasType: AtlasType.Undefined,
  });

  const [photos, setPhotos] = useState<NativePhoto[]>([]);
  const dateString = useMemo(() => recordDateFormat(state.date), [state.date]);

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
        Notifications.invalidCoordinates.title,
        Notifications.invalidCoordinates.message
      );

      return false;
    }

    return true;
  };

  const UploadRecord = useCallback(
    () => (
      <HeaderButton
        testID={TestIds.RecordScreen.UploadButton}
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

    uploadRecord(state, photos)
      .then(() => {
        Alert.alert(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        );
      })
      .catch((error) => {
        Logger.Warn(`Failed to upload record: ${error}`);
        Alert.alert(
          Notifications.uploadFailed.title,
          Notifications.uploadFailed.message
        );
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
            setType={(type) =>
              setState((prev) => {
                let { atlasType } = prev;

                if (isAtlas(prev.type) && !isAtlas(type)) {
                  atlasType = AtlasType.Undefined;
                } else if (!isAtlas(prev.type) && isAtlas(type)) {
                  atlasType = AtlasType.SnowAlgae;
                }

                return { ...prev, type, atlasType };
              })
            }
          />

          {/* Date of Sample, Sighting, Atlas, etc */}
          <DateSelector
            date={dateString}
            setDate={(newDate) =>
              setState((prev) => ({
                ...prev,
                date: dateWithOffset(new Date(newDate), "add"),
              }))
            }
          />

          {/* Tube Id: only show Tube Id when recording a Sample */}
          {isSample(state.type) && (
            <CustomTextInput
              description={Labels.RecordFields.TubeId}
              placeholder={Placeholders.RecordScreen.TubeId}
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
            description={`${Labels.RecordFields.LocationDescription} (limit 255 characters)`}
            placeholder={Placeholders.RecordScreen.LocationDescription}
            onChangeText={(locationDescription) =>
              setState((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current?.focus()}
            ref={locationDescriptionRef}
          />

          <CustomTextInput
            description={`${Labels.RecordFields.Notes} (limit 255 characters)`}
            placeholder={Placeholders.RecordScreen.Notes}
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
