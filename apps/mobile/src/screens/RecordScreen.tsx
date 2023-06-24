import React, { useEffect, useRef, useState } from "react";
import { Box, ScrollView } from "native-base";
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
import { setOnFocusTimelineAction } from "./TimelineScreen";
import { uploadRecord } from "../lib/RecordManager";
import { updatePendingRecord } from "../lib/Storage";
import { RecordScreenProps } from "../navigation/Routes";
import { HeaderButton, ThemedBox } from "../components";
import {
  AlgaeRecordTypeSelector,
  AlgaeSizeSelector,
  AlgaeColorSelector,
  CustomTextInput,
  DateSelector,
  GpsCoordinatesInput,
  KeyboardShift,
  PhotoSelector,
  TextArea,
} from "../components/forms";
import { getAppSettings } from "../../AppSettings";
import { Labels, Notifications, Placeholders, TestIds } from "../constants";
import { useToast } from "../hooks";
import {
  ActivityIndicator,
  ToastAlert,
  ToastAlertProps,
} from "../components/feedback";

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

// latitude\longitude can be undefined if:
//  1. location permission off
//  2. can't acquire signal
//  3. entering coordinates manually
type AlgaeRecordInput = Omit<AlgaeRecord, "latitude" | "longitude"> & {
  latitude: number | undefined;
  longitude: number | undefined;
};

// TODO: move to @living-snow/network
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

const isNumber = (value: string | number) => !Number.isNaN(Number(value));

type SpaceProps = {
  my?: string;
};

function Space({ my = "1" }: SpaceProps) {
  return <Box my={my} />;
}

export function RecordScreen({ navigation, route }: RecordScreenProps) {
  const defaultRecord: AlgaeRecordInput = {
    id: uuidv4(),
    type: "Sighting",
    date: dateWithOffset(new Date(), "subtract"), // YYYY-MM-DD
    latitude: 0,
    longitude: 0,
    size: "Select a size",
    colors: ["Select colors"],
    locationDescription: "",
  };

  // NativeBase typings not correct for refs
  const notesRef = useRef<any>(null);
  const locationDescriptionRef = useRef<any>(null);
  const toast = useToast();

  const [status, setStatus] = useState<"Idle" | "Uploading" | "Saving">("Idle");

  // prevents multiple events from quick taps
  const inHandler = useRef(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const appSettings = getAppSettings();
  const editMode = route && route.params && route.params.record;

  // data collected and sent to the service
  const [state, setState] = useState<AlgaeRecordInput>(
    editMode
      ? { ...jsonToRecord<AlgaeRecordInput>(route.params.record) }
      : {
          ...defaultRecord,
          name: appSettings.name ?? "Anonymous",
          organization: appSettings.organization,
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

  const today = recordDateFormat(dateWithOffset(new Date(), "subtract"));
  const dateString = recordDateFormat(state.date);

  const isAlgaeSizeInvalid = () => state.size == defaultRecord.size;
  const areAlgaeColorsInvalid = () =>
    state.colors.length == 0 || state.colors[0] == defaultRecord.colors[0];

  const areGpsCoordinatesInvalid = () =>
    !state.latitude ||
    !state.longitude ||
    !isNumber(state.latitude) ||
    !isNumber(state.longitude);

  // user input form validation
  const isUserInputInvalid = () =>
    areGpsCoordinatesInvalid() ||
    isAlgaeSizeInvalid() ||
    areAlgaeColorsInvalid();

  const onUpdateHandler = () => {
    setDidSubmit(true);

    if (status != "Idle" || inHandler.current || isUserInputInvalid()) {
      return;
    }

    inHandler.current = true;
    setStatus("Saving");

    const toastProps: ToastAlertProps = {
      status: "success",
      title: Notifications.updateRecordSuccess.title,
    };

    // TODO: change updatePendingRecord to take SelectedPhoto?
    updatePendingRecord({
      ...removeEmptyFields(state as AlgaeRecord),
      photos: photos && photos.map((value) => ({ ...value, size: 0 })),
    })
      .catch(() => {
        // TODO: this case is most likely error and not info
        toastProps.status = "info";
        toastProps.title = Notifications.updateRecordFailed.title;
        toastProps.message = Notifications.updateRecordFailed.message;
      })
      .finally(() => {
        setOnFocusTimelineAction("Update Pending");
        navigation.goBack();
        toast.show(<ToastAlert {...toastProps} />);
      });
  };

  const onUploadHandler = () => {
    setDidSubmit(true);

    if (status != "Idle" || inHandler.current || isUserInputInvalid()) {
      return;
    }

    inHandler.current = true;
    setStatus("Uploading");

    const toastProps: ToastAlertProps = {
      status: "success",
      title: Notifications.uploadSuccess.title,
      message: Notifications.uploadSuccess.message,
    };

    // TODO: change uploadRecord to take SelectedPhoto?
    uploadRecord(
      removeEmptyFields(state as AlgaeRecord),
      photos && photos.map((value) => ({ ...value, size: 0 }))
    )
      .then(() => setOnFocusTimelineAction("Update Downloaded"))
      .catch((error) => {
        Logger.Warn(
          `Failed to upload complete record: ${error.title}: ${error.message}`
        );

        setOnFocusTimelineAction("Update Pending");
        // TODO: this could be info (record saved) or it could be error (record failed to save)
        toastProps.status = "info";
        toastProps.title = error.title;
        toastProps.message = error.message;
      })
      .finally(() => {
        navigation.goBack();
        toast.show(<ToastAlert {...toastProps} />);
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
    <>
      <ActivityIndicator isActive={status != "Idle"} caption={status} />
      <KeyboardShift>
        {() => (
          <ScrollView automaticallyAdjustKeyboardInsets>
            <ThemedBox px={2}>
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
                usingGps={!editMode}
                isInvalid={didSubmit && areGpsCoordinatesInvalid()}
                setCoordinates={({ latitude, longitude }) =>
                  setState((prev) => ({ ...prev, latitude, longitude }))
                }
                onSubmitEditing={() => locationDescriptionRef.current?.focus()}
              />

              <Space />
              <AlgaeSizeSelector
                size={state.size}
                isInvalid={didSubmit && isAlgaeSizeInvalid()}
                setSize={(size) => {
                  setState((prev) => ({ ...prev, size }));
                }}
              />

              <Space />
              <AlgaeColorSelector
                colors={state.colors}
                isInvalid={didSubmit && areAlgaeColorsInvalid()}
                onChangeColors={(colors) => {
                  setState((prev) => ({
                    ...prev,
                    colors: [...colors],
                  }));
                }}
              />

              <Space />
              <CustomTextInput
                value={state?.tubeId}
                label={Labels.TubeId}
                placeholder={
                  isSample(state.type)
                    ? Placeholders.RecordScreen.TubeId
                    : Placeholders.RecordScreen.TubeIdDisabled
                }
                maxLength={20}
                isDisabled={!isSample(state.type)}
                onChangeText={(tubeId) =>
                  setState((prev) => ({ ...prev, tubeId }))
                }
                onSubmitEditing={() => locationDescriptionRef.current?.focus()}
              />

              <Space />
              <TextArea
                blurOnSubmit
                value={state?.locationDescription}
                label={`${Labels.RecordScreen.LocationDescription}`}
                placeholder={Placeholders.RecordScreen.LocationDescription}
                ref={locationDescriptionRef}
                onChangeText={(locationDescription) =>
                  setState((prev) => ({ ...prev, locationDescription }))
                }
                onSubmitEditing={() => notesRef.current?.focus()}
              />

              <Space />
              <TextArea
                blurOnSubmit
                value={state?.notes}
                label={`${Labels.RecordScreen.Notes}`}
                placeholder={Placeholders.RecordScreen.Notes}
                ref={notesRef}
                onChangeText={(notes) =>
                  setState((prev) => ({ ...prev, notes }))
                }
              />

              <Space />
              <PhotoSelector navigation={navigation} photos={photos} />

              <Space />
            </ThemedBox>
          </ScrollView>
        )}
      </KeyboardShift>
    </>
  );
}
