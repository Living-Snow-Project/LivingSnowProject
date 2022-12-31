import React, { useEffect, useMemo } from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-media-library";
import {
  ImagesPickerScreenProps,
  ImagesPickerScreenNavigationProp,
} from "../navigation/Routes";
/* eslint-disable import/no-relative-packages */
import { AssetsSelector } from "../../expo-images-picker";
import {
  ResizeType,
  SettingsType,
  StylesType,
  CustomNavigator as CustomNavigatorType,
} from "../../expo-images-picker/src/Types";
import { HeaderButton } from "../components/HeaderButton";
import { TestIds } from "../constants/TestIds";

type CustomNavigatorProps = {
  navigation: ImagesPickerScreenNavigationProp;
  onSuccess: () => void;
};

function CustomNavigator({ navigation, onSuccess }: CustomNavigatorProps) {
  useEffect(() => {
    const DoneAction = (
      <HeaderButton
        testID={TestIds.Icons.DoneSelectingPhotosIcon}
        onPress={onSuccess}
        iconName="checkmark-circle-outline"
        placement="right"
      />
    );

    /* eslint-disable react/no-unstable-nested-components */
    navigation.setOptions({
      headerRight: () => DoneAction,
    });
  }, [navigation, onSuccess]);

  return null;
}

const widgetStyles: StylesType = {
  margin: 3,
  bgColor: "white",
  spinnerColor: "blue",
  widgetWidth: 100,
  screenStyle: {
    borderRadius: 5,
    overflow: "hidden",
  },
  widgetStyle: {
    margin: 10,
  },
  videoIcon: {
    Component: Ionicons,
    iconName: Platform.OS == "ios" ? "ios-videocam" : "md-videocam",
    color: "white",
    size: 20,
  },
  selectedIcon: {
    Component: Ionicons,
    iconName:
      Platform.OS == "ios"
        ? "ios-checkmark-circle-outline"
        : "md-checkmark-circle-outline",
    color: "red",
    bg: "#00000000",
    size: 40,
  },
};

const widgetResize: ResizeType = {
  compress: 0.7,
  majorAxis: 1024,
  base64: false,
  saveTo: "jpeg",
};

// TODO: probably should do something here
const widgetErrors = {};

export function ImagesPickerScreen({
  navigation,
  route,
}: ImagesPickerScreenProps) {
  const widgetSettings: SettingsType = useMemo(
    () => ({
      getImageMetaData: false,
      initialLoad: 100,
      assetsType: ["photo"],
      minSelection: 0,
      maxSelection: 4,
      existingSelectionIds: route.params.existingSelection,
      portraitCols: 4,
      landscapeCols: 5,
    }),
    [route]
  );

  const customNavigatorWidget: CustomNavigatorType = useMemo(
    () => ({
      Component: CustomNavigator,
      props: {
        navigation,
        onSuccess: (data: Asset[]) => {
          navigation.navigate({ name: "Record", params: { photos: data } });
        },
      },
    }),
    [navigation]
  );

  return (
    <AssetsSelector
      Settings={widgetSettings}
      Styles={widgetStyles}
      Errors={widgetErrors}
      Resize={widgetResize}
      CustomNavigator={customNavigatorWidget}
    />
  );
}
