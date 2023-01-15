import React from "react";
import { AddIcon, Box, FormControl, Pressable } from "native-base";
import { SelectedPhoto } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { Labels, TestIds } from "../../constants";
import { PhotosLayout } from "../PhotosLayout";

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
        <Box mx={-2} _dark={{ bg: "dark.100" }}>
          <PhotosLayout photos={photos} />
        </Box>
      );
    }

    return (
      <Box height="52" width="52" _dark={{ bg: "dark.100" }}>
        <AddIcon size="50" color="primary.600" />
      </Box>
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
