import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Logger from "@livingsnow/logger";
import {
  AlgaeRecord,
  Photo,
  SelectedPhoto,
  isSample,
  recordDateFormat,
} from "@livingsnow/record";
import { RecordScreenProps } from "../navigation/Routes";
import KeyboardShift from "../components/KeyboardShift";
import { formInputStyles } from "../styles/FormInput";
import HeaderButton from "../components/HeaderButton";
import {
  TypeSelector,
  AlgaeSizePicker,
  AlgaeColorPicker,
} from "../components/forms/TypeSelector";
import DateSelector from "../components/forms/DateSelector";
import CustomTextInput from "../components/forms/CustomTextInput";
import GpsCoordinatesInput from "../components/forms/GpsCoordinatesInput";
import PhotoControl from "../components/forms/PhotoControl";
import { getAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";
import { Labels, Notifications, Placeholders } from "../constants/Strings";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";

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

const defaultRecord: AlgaeRecord = {
  id: -1,
  type: "Sample",
  date: dateWithOffset(new Date(), "subtract"), // YYYY-MM-DD
  latitude: 0,
  longitude: 0,
  size: "Select a size",
  color: "Select a color",
};

export default function RecordScreen({ navigation, route }: RecordScreenProps) {
  const appSettings = getAppSettings();

  // TODO: get updating\uploading from reducer
  const [updating, setUpdating] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  // NativeBase typings not quite right for refs
  const notesRef = useRef<any>(null);
  const locationDescriptionRef = useRef<any>(null);

  const algaeRecordsContext = useAlgaeRecordsContext();

  // data collected and sent to the service
  const [state, setState] = useState<AlgaeRecord>(
    route === undefined || route.params === undefined
      ? {
          ...defaultRecord,
          id: uuidv4(),
          name: appSettings.name ? appSettings.name : "Anonymous",
          organization: !appSettings.organization
            ? undefined
            : appSettings.organization,
          size: "Select a size",
          color: "Select a color",
        }
      : { ...route.params.record }
  );

  // don't want to change AlgaeRecord type for editing a pending record while offline
  // but do want to preserve the SelectedPhotos experience
  const [photos, setPhotos] = useState<SelectedPhoto[]>(() => {
    if (!route || !route.params || !route.params.record.photos) {
      return [];
    }

    return route.params.record.photos.map((photo: Photo | SelectedPhoto) => {
      if ("id" in photo) {
        return { ...photo };
      }

      return {
        id: "",
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
      };
    });
  });

  const dateString = useMemo(() => recordDateFormat(state.date), [state.date]);

  // user input form validation
  const validateUserInput = () => {
    const isNumber = (value: string | number) => !Number.isNaN(Number(value));

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

    if (state.size === "Select a size") {
      Alert.alert(Notifications.invalidAlgaeSize.title);
      return false;
    }

    if (state.color === "Select a color") {
      Alert.alert(Notifications.invalidAlgaeColor.title);
      return false;
    }

    return true;
  };

  // unmodified records do not send these fields
  // so if the fields are empty during submission, do not send them
  const removeEmptyFields = useCallback((record: AlgaeRecord): AlgaeRecord => {
    const newRecord = { ...record };

    if (newRecord.type === "Sighting" || newRecord?.tubeId === "") {
      delete newRecord.tubeId;
    }

    if (newRecord?.locationDescription === "") {
      delete newRecord.locationDescription;
    }

    if (newRecord?.notes === "") {
      delete newRecord.notes;
    }

    return newRecord;
  }, []);

  const editMode = route !== undefined && route.params !== undefined;

  useEffect(() => {
    const RecordAction = editMode ? (
      <HeaderButton
        testID={TestIds.RecordScreen.UpdateButton}
        onPress={() => setUpdating(true)}
        iconName="save-outline"
        placement="right"
      />
    ) : (
      <HeaderButton
        testID={TestIds.RecordScreen.UploadButton}
        onPress={() => setUploading(true)}
        iconName="cloud-upload"
        placement="right"
      />
    );

    navigation.setOptions({
      headerRight: () => RecordAction,
    });
  }, []);

  // update record effect
  // TODO: get updating state from reducer
  useEffect(() => {
    if (!updating) return;

    if (!validateUserInput()) {
      setUpdating(false);
      return;
    }

    // TODO: change updatePendingRecord to take SelectedPhoto?
    algaeRecordsContext
      .updatePendingRecord({
        ...removeEmptyFields(state),
        photos: photos && photos.map((value) => ({ ...value, size: 0 })),
      })
      .then(() => Alert.alert(Notifications.updateRecordSuccess.title))
      .catch(() =>
        Alert.alert(
          Notifications.updateRecordFailed.title,
          Notifications.updateRecordFailed.message
        )
      )
      .finally(() => {
        setUpdating(false);
        navigation.goBack();
      });
  }, [updating]);

  // upload record effect
  // TODO: get uploading state from reducer
  useEffect(() => {
    if (!uploading) return;

    if (!validateUserInput()) {
      setUploading(false);
      return;
    }

    // TODO: change uploadRecord to take SelectedPhoto?
    algaeRecordsContext
      .uploadRecord(
        removeEmptyFields(state),
        photos && photos.map((value) => ({ ...value, size: 0 }))
      )
      .then(() =>
        Alert.alert(
          Notifications.uploadSuccess.title,
          Notifications.uploadSuccess.message
        )
      )
      .catch((error) => {
        Logger.Warn(
          `Failed to upload complete record: ${error.title}: ${error.message}`
        );
        Alert.alert(error.title, error.message);
      })
      .finally(() => {
        setUploading(false);
        algaeRecordsContext.downloadRecords();
        navigation.goBack();
      });
  }, [uploading]);

  const gpsCoordinatesProps = editMode
    ? { coordinates: { latitude: state.latitude, longitude: state.longitude } }
    : {};

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

          {/* Sample, Sighting */}
          <TypeSelector
            type={state.type}
            setType={(type) => setState((prev) => ({ ...prev, type }))}
          />

          {/* Date of Sample, Sighting */}
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
              value={state?.tubeId}
              label={Labels.RecordFields.TubeId}
              placeholder={Placeholders.RecordScreen.TubeId}
              maxLength={20}
              onChangeText={(tubeId) =>
                setState((prev) => ({ ...prev, tubeId }))
              }
              onSubmitEditing={() => locationDescriptionRef.current?.focus()}
            />
          )}

          <GpsCoordinatesInput
            {...gpsCoordinatesProps}
            setGpsCoordinates={(latitude, longitude) =>
              setState((prev) => ({ ...prev, latitude, longitude }))
            }
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
          />

          <AlgaeSizePicker
            size={state.size}
            setSize={(size) => {
              setState((prev) => ({ ...prev, size }));
            }}
          />

          <AlgaeColorPicker
            color={state.color}
            setColor={(color) => {
              setState((prev) => ({ ...prev, color }));
            }}
          />

          <CustomTextInput
            value={state?.locationDescription}
            label={`${Labels.RecordFields.LocationDescription} (limit 255 characters)`}
            placeholder={Placeholders.RecordScreen.LocationDescription}
            onChangeText={(locationDescription) =>
              setState((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current?.focus()}
            ref={locationDescriptionRef}
          />

          <CustomTextInput
            value={state?.notes}
            label={`${Labels.RecordFields.Notes} (limit 255 characters)`}
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
