import React, { useCallback } from "react";
import { Platform, Text } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
/* eslint-disable import/no-relative-packages */
import { AssetsSelector } from "../../expo-images-picker/index";

export default function ImagesPickerScreen({ navigation, route }) {
  const noAssets = useCallback(() => <Text>No Assets</Text>, []);
  return (
    <AssetsSelector
      options={{
        manipulate: {
          compress: 0.4,
          width: 1024, // TODO: ideally this would be the size constraint on the largest axis
          base64: false,
          saveTo: "jpeg",
        },
        assetsType: ["photo"],
        maxSelections: 4,
        margin: 3,
        portraitCols: 4,
        landscapeCols: 5,
        widgetWidth: 100,
        widgetBgColor: "white",
        spinnerColor: "blue",
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
        defaultTopNavigator: {
          // TODO: this should be on react-navigation header not the component's
          // TODO: possible to eliminate goBackText and backFunction?
          continueText: "Finish",
          goBackText: ``,
          buttonStyle: {},
          buttonTextStyle: {},
          selectedText: ``,
          backFunction: () => {},
          doneFunction: (data) => {
            route.params.onUpdatePhotos(data);
            navigation.goBack();
          },
        },
        noAssets: () => noAssets(),
      }}
    />
  );
}

ImagesPickerScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      onUpdatePhotos: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};
