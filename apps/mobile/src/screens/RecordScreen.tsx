import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Box } from "native-base";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Logger from "@livingsnow/logger";
import {
  AlgaeRecord,
  Photo,
  SelectedPhoto,
  jsonToRecord,
  isSample,
  recordDateFormat,
} from "@livingsnow/record";
import { RecordScreenProps } from "../navigation/Routes";
import { KeyboardShift } from "../components/KeyboardShift";
import { formInputStyles } from "../styles/FormInput";
import { HeaderButton } from "../components/HeaderButton";
import {
  AlgaeRecordTypeSelector,
  AlgaeSizeSelector,
  AlgaeColorSelector,
} from "../components/forms/TypeSelector";
import { DateSelector } from "../components/forms/DateSelector";
import { CustomTextInput } from "../components/forms/CustomTextInput";
import { GpsCoordinatesInput } from "../components/forms/GpsCoordinatesInput";
import { PhotoSelector } from "../components/forms/PhotoSelector";
import { getAppSettings } from "../../AppSettings";
import { TestIds } from "../constants/TestIds";
import { Labels, Notifications, Placeholders } from "../constants/Strings";
import { useAlgaeRecordsContext } from "../hooks/useAlgaeRecords";

// TODO: move to @living-snow/records
type OffsetOperation = "add" | "subtract";

// unfortunate, because how react-native-calendar works with dates
const dateWithOffset = (date: Date, op: OffsetOperation): Date => {
  if (op == "add") {
    return new Date(
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    );
  }

  return new Date(
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  );
};

const today = recordDateFormat(dateWithOffset(new Date(), "subtract"));

// latitude\longitude can be undefined if:
//  1. location permission off
//  2. can't acquire signal
//  3. entering coordinates manually
type AlgaeRecordInput = Omit<AlgaeRecord, "latitude" | "longitude"> & {
  latitude: number | undefined;
  longitude: number | undefined;
};

// TODO: move to @living-snow/records
// unmodified records do not send these fields
// so if the fields are empty during submission, do not send them
const removeEmptyFields = (record: AlgaeRecord): AlgaeRecord => {
  const newRecord = { ...record };

  if (newRecord.type == "Sighting" || newRecord?.tubeId == "") {
    delete newRecord.tubeId;
  }

  if (newRecord?.locationDescription == "") {
    delete newRecord.locationDescription;
  }

  if (newRecord?.notes == "") {
    delete newRecord.notes;
  }

  return newRecord;
};

const defaultRecord: AlgaeRecordInput = {
  id: -1,
  type: "Sighting",
  date: dateWithOffset(new Date(), "subtract"), // YYYY-MM-DD
  latitude: 0,
  longitude: 0,
  size: "Select a size",
  color: "Select a color",
};

type SpaceProps = {
  my?: string;
};

function Space({ my = "1" }: SpaceProps) {
  return <Box my={my} />;
}

export function RecordScreen({ navigation, route }: RecordScreenProps) {
  // NativeBase typings not correct for refs
  const notesRef = useRef<any>(null);
  const locationDescriptionRef = useRef<any>(null);

  const algaeRecords = useAlgaeRecordsContext();
  const algaeRecordsState = algaeRecords.getCurrentState();

  const appSettings = getAppSettings();
  const editMode = route && route.params && route.params.record;

  // data collected and sent to the service
  const [state, setState] = useState<AlgaeRecordInput>(
    editMode
      ? { ...jsonToRecord<AlgaeRecordInput>(route.params.record) }
      : {
          ...defaultRecord,
          id: uuidv4(),
          name: appSettings.name ?? "Anonymous",
          organization: appSettings.organization,
          size: "Select a size",
          color: "Select a color",
        }
  );

  /* TODO: merge setState and setPhotos in to single useState
	  1. change upload\update /lib to take pending photo (rename to [Client|Input]Photo)
	  2. Typings for ServiceAlgaeRecord and [Client|Input]AlgaeRecord
       a. typings are messy right now with all this mapping and omit nonsense

  don't want to change AlgaeRecord type for editing a pending record while offline
  but do want to preserve the SelectedPhotos experience */
  const [photos, setPhotos] = useState<SelectedPhoto[]>(() => {
    if (!editMode || !state.photos) {
      return [];
    }

    return state.photos.map((photo: Photo | SelectedPhoto) => {
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

  // navigation.navigate from ImagesPickerScreen with selected photos
  useEffect(() => {
    if (route?.params?.photos) {
      setPhotos(route.params.photos);
    }
  }, [route?.params?.photos]);

  const dateString = recordDateFormat(state.date);

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

    if (state.size == "Select a size") {
      Alert.alert(Notifications.invalidAlgaeSize.title);
      return false;
    }

    if (state.color == "Select a color") {
      Alert.alert(Notifications.invalidAlgaeColor.title);
      return false;
    }

    return true;
  };

  const onUpdateHandler = () => {
    if (algaeRecordsState != "Idle" || !validateUserInput()) {
      return;
    }

    // TODO: change updatePendingRecord to take SelectedPhoto?
    algaeRecords
      .updatePendingRecord({
        ...removeEmptyFields(state as AlgaeRecord),
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
        navigation.goBack();
      });
  };

  const onUploadHandler = () => {
    if (algaeRecordsState != "Idle" || !validateUserInput()) {
      return;
    }

    // TODO: change uploadRecord to take SelectedPhoto?
    algaeRecords
      .uploadRecord(
        removeEmptyFields(state as AlgaeRecord),
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
        algaeRecords.downloadRecords();
        navigation.goBack();
      });
  };

  useEffect(() => {
    const RecordAction = editMode ? (
      <HeaderButton
        testID={TestIds.RecordScreen.UpdateButton}
        onPress={onUpdateHandler}
        iconName="save-outline"
        placement="right"
      />
    ) : (
      <HeaderButton
        testID={TestIds.RecordScreen.UploadButton}
        onPress={onUploadHandler}
        iconName="cloud-upload"
        placement="right"
      />
    );

    navigation.setOptions({
      headerRight: () => RecordAction,
    });
    // event handlers need to refresh whenever state or photos update
    // this is safe because navigation header renders independently of screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, photos]);

  return (
    <KeyboardShift>
      {() => (
        <ScrollView style={formInputStyles.container}>
          <AlgaeRecordTypeSelector
            type={state.type}
            setType={(type) => setState((prev) => ({ ...prev, type }))}
          />

          <Space />
          <DateSelector
            date={dateString}
            maxDate={today}
            setDate={(newDate) =>
              setState((prev) => ({
                ...prev,
                date: dateWithOffset(new Date(newDate), "add"),
              }))
            }
          />

          <Space />
          <GpsCoordinatesInput
            coordinates={{
              latitude: state.latitude,
              longitude: state.longitude,
            }}
            setCoordinates={({ latitude, longitude }) =>
              setState((prev) => ({ ...prev, latitude, longitude }))
            }
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
            usingGps={!editMode}
          />

          <Space />
          <AlgaeSizeSelector
            size={state.size}
            setSize={(size) => {
              setState((prev) => ({ ...prev, size }));
            }}
          />

          <Space />
          <AlgaeColorSelector
          /* TODO: v2 API colors={state.color}
            setColors={(color) => {
              setState((prev) => ({ ...prev, color }));
            }} */
          />

          <Space />
          <CustomTextInput
            value={state?.tubeId}
            label={Labels.RecordFields.TubeId}
            placeholder={
              isSample(state.type)
                ? Placeholders.RecordScreen.TubeId
                : Placeholders.RecordScreen.TubeIdDisabled
            }
            maxLength={20}
            isDisabled={!isSample(state.type)}
            onChangeText={(tubeId) => setState((prev) => ({ ...prev, tubeId }))}
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
          />

          <Space />
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

          <Space />
          <CustomTextInput
            value={state?.notes}
            label={`${Labels.RecordFields.Notes} (limit 255 characters)`}
            placeholder={Placeholders.RecordScreen.Notes}
            onChangeText={(notes) => setState((prev) => ({ ...prev, notes }))}
            ref={notesRef}
          />

          <Space />
          <PhotoSelector navigation={navigation} photos={photos} />
          <Space my="2" />
        </ScrollView>
      )}
    </KeyboardShift>
  );
}
