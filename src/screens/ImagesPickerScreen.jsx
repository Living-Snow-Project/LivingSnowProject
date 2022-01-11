import React from "react";
import { Platform, Text } from "react-native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { AssetsSelector } from "../../expo-images-picker/index";

export default function ImagesPickerScreen({ navigation, route }) {
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
        selectedBgColor: "red",
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
          continueText: "Finish",
          goBackText: null,
          // buttonStyle: {borderWidth:2, borderColor:'red'},
          textStyle: { fontSize: 15 },
          backFunction: () => {},
          doneFunction: (data) => {
            route.params.onUpdatePhotos(data);
            navigation.goBack();
          },
        },
        noAssets: <Text>No Assets</Text>,
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
