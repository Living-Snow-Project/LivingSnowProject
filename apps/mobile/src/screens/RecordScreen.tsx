import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, ScrollView } from "native-base";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import { useFocusEffect } from "@react-navigation/native";
import Logger from "@livingsnow/logger";
import {
  AlgaeRecord,
  jsonToRecord,
  isSample,
  recordDateFormat,
  AlgaeRecordV3,
} from "@livingsnow/record";
import { SelectedPhoto } from "../../types";
import { setOnFocusTimelineAction } from "./TimelineScreen";
import { RecordManager, UploadError } from "../lib/RecordManager";
import { PhotoManager } from "../lib/PhotoManager";
import { updatePendingRecord } from "../lib/Storage";
import { RecordScreenProps } from "../navigation/Routes";
import { HeaderButton, ThemedBox } from "../components";
import {
  AlgaeRecordTypeSelector,
  AlgaeSizeSelector,
  AlgaeColorSelector,
  CustomTextInput,
  DateSelector,
  ExpoPhotoSelector,
  GpsCoordinatesInput,
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
// TODO: there are some weird scenarios here, what if 1 & 2 is a thing, user is blocked from saving record, is that ok?
// then if they enter bogus numbers to save, those numbers will upload later
type AlgaeRecordInput = Omit<AlgaeRecordV3, "latitude" | "longitude"> & {
  latitude: number | undefined;
  longitude: number | undefined;
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

  const [status, setStatus] = useState<
    "Idle" | "Uploading" | "Saving" | "Loading"
  >("Idle");

  // prevents multiple events from quick taps
  const inHandler = useRef(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const appSettings = getAppSettings();
  const editMode = route && route.params && route.params.record;

  // data collected and sent to the service
  const [record, setRecord] = useState<AlgaeRecordInput>(
    editMode
      ? { ...jsonToRecord<AlgaeRecordInput>(route.params.record) }
      : {
          ...defaultRecord,
          name: appSettings.name ?? "Anonymous",
          organization: appSettings.organization,
        }
  );

  const onFocusEffect = React.useCallback(() => {
    // This should be run when screen gains focus - enable the module where it's needed
    AvoidSoftInput.setEnabled(true);
    AvoidSoftInput.setAdjustPan();
    return () => {
      // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect); // register callback to focus events

  const [selectedPhotos, setSelectedPhotos] = useState<SelectedPhoto[]>([]);

  // initialization; modifying existing record
  useEffect(() => {
    if (editMode) {
      PhotoManager.getSelected(record.id).then((photos) => {
        if (photos) {
          setSelectedPhotos(photos);
        }
      });
    }
  }, [editMode, record.id]);

  const today = recordDateFormat(dateWithOffset(new Date(), "subtract"));
  const dateString = recordDateFormat(record.date);

  const isAlgaeSizeInvalid = () => record.size == defaultRecord.size;
  const areAlgaeColorsInvalid = () =>
    record.colors.length == 0 || record.colors[0] == defaultRecord.colors[0];

  const areGpsCoordinatesInvalid = () =>
    !record.latitude ||
    !record.longitude ||
    !isNumber(record.latitude) ||
    !isNumber(record.longitude);

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

    updatePendingRecord(record as AlgaeRecord)
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

    RecordManager.uploadV3(record as AlgaeRecordV3, uuidv4())
      .then(() => setOnFocusTimelineAction("Update Downloaded"))
      .catch((error: UploadError) => {
        Logger.Warn(
          `Failed to upload complete record: ${error.errorInfo.title}: ${error.errorInfo.message}`
        );

        setOnFocusTimelineAction("Update Pending");
        // TODO: this could be info (record saved) or it could be error (record failed to save)
        toastProps.status = "info";
        toastProps.title = error.errorInfo.title;
        toastProps.message = error.errorInfo.message;
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

    // event handlers need to refresh whenever state, status, or photos update
    // this is safe because navigation header renders independently of screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, status, selectedPhotos]);

  const setCoordinates = useCallback(
    ({ latitude, longitude }) =>
      setRecord((prev) => ({ ...prev, latitude, longitude })),
    [setRecord]
  );

  return (
    <>
      <ActivityIndicator isActive={status != "Idle"} caption={status} />
      <ScrollView automaticallyAdjustKeyboardInsets>
        <ThemedBox px={2}>
          <AlgaeRecordTypeSelector
            type={record.type}
            setType={(type) => setRecord((prev) => ({ ...prev, type }))}
          />

          <Space />
          <DateSelector
            date={dateString}
            maxDate={today}
            setDate={(newDate) =>
              setRecord((prev) => ({
                ...prev,
                date: dateWithOffset(new Date(newDate), "add"),
              }))
            }
          />

          <Space />
          <GpsCoordinatesInput
            coordinates={{
              latitude: record.latitude,
              longitude: record.longitude,
            }}
            usingGps={!editMode}
            isInvalid={didSubmit && areGpsCoordinatesInvalid()}
            setCoordinates={setCoordinates}
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
          />

          <Space />
          <AlgaeSizeSelector
            size={record.size}
            isInvalid={didSubmit && isAlgaeSizeInvalid()}
            setSize={(size) => {
              setRecord((prev) => ({ ...prev, size }));
            }}
          />

          <Space />
          <AlgaeColorSelector
            colors={record.colors}
            isInvalid={didSubmit && areAlgaeColorsInvalid()}
            onChangeColors={(colors) => {
              setRecord((prev) => ({
                ...prev,
                colors: [...colors],
              }));
            }}
          />

          <Space />
          <CustomTextInput
            value={record?.tubeId}
            label={Labels.TubeId}
            placeholder={
              isSample(record.type)
                ? Placeholders.RecordScreen.TubeId
                : Placeholders.RecordScreen.TubeIdDisabled
            }
            maxLength={20}
            isDisabled={!isSample(record.type)}
            onChangeText={(tubeId) =>
              setRecord((prev) => ({ ...prev, tubeId }))
            }
            onSubmitEditing={() => locationDescriptionRef.current?.focus()}
          />

          <Space />
          <TextArea
            blurOnSubmit
            value={record?.locationDescription}
            label={`${Labels.RecordScreen.LocationDescription}`}
            placeholder={Placeholders.RecordScreen.LocationDescription}
            ref={locationDescriptionRef}
            onChangeText={(locationDescription) =>
              setRecord((prev) => ({ ...prev, locationDescription }))
            }
            onSubmitEditing={() => notesRef.current?.focus()}
          />

          <Space />
          <TextArea
            blurOnSubmit
            value={record?.notes}
            label={`${Labels.RecordScreen.Notes}`}
            placeholder={Placeholders.RecordScreen.Notes}
            ref={notesRef}
            onChangeText={(notes) => setRecord((prev) => ({ ...prev, notes }))}
          />

          <Space />
          <ExpoPhotoSelector
            recordId={record.id}
            photos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            setStatus={setStatus}
          />

          <Space />
        </ThemedBox>
      </ScrollView>
    </>
  );
}
