import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImagesPickerScreenProps } from "../navigation/Routes";
/* eslint-disable import/no-relative-packages */
import { AssetsSelector } from "../../expo-images-picker";
import { SettingsType, StylesType } from "../../expo-images-picker/src/Types";

export default function ImagesPickerScreen({
  navigation,
  route,
}: ImagesPickerScreenProps) {
  const widgetSettings: SettingsType = {
    getImageMetaData: false,
    initialLoad: 100,
    assetsType: ["photo"],
    minSelection: 0,
    maxSelection: 4,
    portraitCols: 4,
    landscapeCols: 5,
  };

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
      iconName: Platform.OS === "ios" ? "ios-videocam" : "md-videocam",
      color: "white",
      size: 20,
    },
    selectedIcon: {
      Component: Ionicons,
      iconName:
        Platform.OS === "ios"
          ? "ios-checkmark-circle-outline"
          : "md-checkmark-circle-outline",
      color: "grey",
      bg: "lightgrey",
      size: 40,
    },
  };

  const widgetNavigator = {
    Texts: {
      finish: "Finish",
      back: "Back",
      selected: "",
    },
    buttonTextStyle: {},
    buttonStyle: {},
    // TODO: this should be on react-navigation header not the component's
    // TODO: possible to eliminate goBackText and backFunction?
    onBack: () => () => {},
    onSuccess: (data: any[]) => {
      route.params.onUpdatePhotos(data);
      navigation.goBack();
    },
  };

  const widgetResize = {
    compress: 0.4,
    width: 1024, // TODO: ideally this would be the size constraint on the largest axis
    base64: false,
    saveTo: "jpeg",
  };

  return (
    // TODO: how to tell what's already selected
    <AssetsSelector
      Settings={widgetSettings}
      Styles={widgetStyles}
      Errors={{}}
      Navigator={widgetNavigator}
      Resize={widgetResize}
    />
  );
}
