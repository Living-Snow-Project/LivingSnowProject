import React, {
  useCallback,
  useContext,
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
import Logger from "../lib/Logger";
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
import AtlasSelector from "../components/forms/AtlasSelector";
import PhotoControl from "../components/PhotoControl";
import { isAtlas, isSample, recordDateFormat } from "../record/Record";
import { getAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";
import { Labels, Notifications, Placeholders } from "../constants/Strings";
import { RecordReducerActionsContext } from "../hooks/useRecordReducer";
import { AlgaeRecordPropType } from "../record/PropTypes";

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

type RecordScreenRouteProp = {
  params: {
    record: AlgaeRecord;
  };
};

type RecordScreenProps = {
  navigation: {
    goBack: () => void;
    setOptions: ({ headerRight }: { headerRight: () => JSX.Element }) => void;
  };
  route: RecordScreenRouteProp;
};

const defaultRouteProps: RecordScreenRouteProp = {
  params: {
    record: {
      id: -1,
      type: "Sample",
      date: dateWithOffset(new Date(), "subtract"), // YYYY-MM-DD
      latitude: 0,
      longitude: 0,
      size: "Select a size",
      color: "Select a color",
    },
  },
};

export default function RecordScreen({
  navigation,
  route = defaultRouteProps,
}: RecordScreenProps) {
  const appSettings = getAppSettings();

  // TODO: get updating\uploading from reducer
  const [updating, setUpdating] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editMode] = useState<boolean>(
    route?.params?.record?.id !== -1 && route?.params?.record !== undefined
  );

  const notesRef = useRef<TextInput>(null);
  const locationDescriptionRef = useRef<TextInput>(null);

  const recordReducerActionsContext = useContext(RecordReducerActionsContext);

  // data collected and sent to the service
  const [state, setState] = useState<AlgaeRecord>(
    editMode
      ? route.params.record
      : {
          ...defaultRouteProps.params.record,
          id: uuidv4(),
          name: appSettings.name ? appSettings.name : "Anonymous",
          organization: !appSettings.organization
            ? undefined
            : appSettings.organization,
        }
  );

  const [photos, setPhotos] = useState<Photo[]>(
    editMode && route.params.record.photos ? route.params.record.photos : []
  );

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

    if (newRecord?.atlasType && newRecord.atlasType === "Undefined") {
      delete newRecord.atlasType;
    }

    return newRecord;
  }, []);

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

    recordReducerActionsContext
      .updatePendingRecord({
        ...removeEmptyFields(state),
        photos,
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

    recordReducerActionsContext
      .uploadRecord(removeEmptyFields(state), photos)
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
        recordReducerActionsContext.downloadRecords();
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

          {/* Sample, Sighting, Atlas, etc */}
          <TypeSelector
            type={state.type}
            setType={(type) =>
              setState((prev) => {
                let { atlasType } = prev;

                if (isAtlas(prev.type) && !isAtlas(type)) {
                  atlasType = "Undefined";
                } else if (!isAtlas(prev.type) && isAtlas(type)) {
                  atlasType = "Snow Algae";
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
              defaultValue={state?.tubeId}
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

          {state?.atlasType && (
            <AtlasSelector
              recordType={state.type}
              atlasType={state.atlasType}
              setAtlasType={(atlasType) =>
                setState((prev) => ({ ...prev, atlasType }))
              }
            />
          )}

          <CustomTextInput
            defaultValue={state?.locationDescription}
            description={`${Labels.RecordFields.LocationDescription} (limit 255 characters)`}
            placeholder={Placeholders.RecordScreen.LocationDescription}
            onChangeText={(locationDescription) =>
              setState((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current?.focus()}
            ref={locationDescriptionRef}
          />

          <CustomTextInput
            defaultValue={state?.notes}
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
  route: PropTypes.shape({
    params: PropTypes.shape({
      record: AlgaeRecordPropType,
    }),
  }),
};

RecordScreen.defaultProps = {
  route: defaultRouteProps,
};
