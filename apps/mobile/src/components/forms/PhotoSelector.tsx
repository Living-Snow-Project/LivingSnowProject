import React from "react";
import { FormControl, Pressable } from "native-base";
import { SelectedPhoto } from "../../../types";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { ThemedBox } from "../layout";
import { AddPhotosIcon, PhotosLayout } from "../media";
import { Labels, TestIds } from "../../constants";

type PhotoSelectorProps = {
  navigation: RootStackNavigationProp;
  photos: SelectedPhoto[];
};

export function PhotoSelector({ navigation, photos }: PhotoSelectorProps) {
  const handleOnPress = () => {
    let existingSelection: string[] | undefined;

    if (photos.length > 0) {
      existingSelection = [];
      for (let i = 0; i < photos.length; i++) {
        existingSelection.push(photos[i].id);
      }
    }

    navigation.navigate("ImageSelection", { existingSelection });
  };

  const renderPhotos = () => {
    if (photos.length) {
      return (
        <ThemedBox mx={-2}>
          <PhotosLayout photos={photos} />
        </ThemedBox>
      );
    }

    return (
      <ThemedBox height="52" width="52">
        <AddPhotosIcon />
      </ThemedBox>
    );
  };

  return (
    <FormControl>
      <FormControl.Label>{Labels.RecordScreen.Photos}</FormControl.Label>
      <Pressable testID={TestIds.Selectors.Photos} onPress={handleOnPress}>
        {renderPhotos()}
      </Pressable>
    </FormControl>
  );
}
