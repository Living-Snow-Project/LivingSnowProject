import React from "react";
import { LogBox, Pressable, Text } from "react-native";
import { SelectedPhoto } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { formInputStyles } from "../../styles/FormInput";
import TestIds from "../../constants/TestIds";
import { PictureIcon } from "../Icons";
import PhotosLayout from "../PhotosLayout";

// because we pass a callback in params, more info from the following links
// follow links for best practices, look at Context
// https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
// https://reactnavigation.org/docs/params/
// https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

type PhotoControlProps = {
  navigation: RootStackNavigationProp;
  photos: SelectedPhoto[];
  onUpdatePhotos: (photos: SelectedPhoto[]) => void;
};

export default function PhotoControl({
  navigation,
  photos,
  onUpdatePhotos,
}: PhotoControlProps) {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        Select Photos (limit 4)
      </Text>
      <Pressable
        testID={TestIds.Photos.photoSelectorTestId}
        onPress={() => {
          let existingSelection: string[] | undefined;

          if (photos.length > 0) {
            existingSelection = [];
            for (let i = 0; i < photos.length; i++) {
              existingSelection.push(photos[i].id);
            }
          }

          navigation.navigate("ImageSelection", {
            existingSelection,
            onUpdatePhotos,
          });
        }}
      >
        {photos.length === 0 && <PictureIcon />}
        {photos.length > 0 && <PhotosLayout photos={photos} />}
      </Pressable>
    </>
  );
}
