import React from "react";
import { FormControl, Pressable } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { manipulateAsync, ActionResize } from "expo-image-manipulator";
import { SelectedPhoto } from "../../../types";
import { ThemedBox } from "../layout";
import { AddPhotosIcon, PhotosLayout } from "../media";
import { PhotoManager } from "../../lib/PhotoManager";
import { Labels, TestIds } from "../../constants";
import { useToast } from "../../hooks";
import { ToastAlert } from "../feedback";

type ExpoPhotoSelectorProps = {
  recordId: string;
  photos: SelectedPhoto[];
  setSelectedPhotos: (selectedPhotos: SelectedPhoto[]) => void;
  setStatus: (status: "Idle" | "Loading") => void;
};

export function ExpoPhotoSelector({
  recordId,
  photos,
  setSelectedPhotos,
  setStatus,
}: ExpoPhotoSelectorProps) {
  const toast = useToast();

  const handleOnPress = async () => {
    setStatus("Loading");

    try {
      const permission = await MediaLibrary.getPermissionsAsync();

      if (!permission.granted) {
        const granted = await MediaLibrary.requestPermissionsAsync();

        if (!granted.granted) {
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        quality: 0.7,
      });

      // TODO: should "cancel" unselect all? there is no way to go back to 0 selected after first selection
      if (!result.canceled) {
        const assets: MediaLibrary.Asset[] = [];

        await result.assets.reduce(async (promise, current) => {
          await promise;

          const dims: ActionResize = { resize: {} };

          if (current.height > current.width) {
            dims.resize.height = 1024;
          } else {
            dims.resize.width = 1024;
          }

          const resizedImage = await manipulateAsync(current.uri, [dims]);

          // current.assetId is coming back null on Android and
          // we don't need the extra fields from MediaLibrary.getAssetInfoAsync
          // but have to make TypeScript happy

          assets.push({
            height: resizedImage.height,
            uri: resizedImage.uri,
            width: resizedImage.width,
            id: current.assetId || "",
            filename: current.fileName || "",
            mediaType: "photo",
            creationTime: 0,
            modificationTime: 0,
            duration: current.duration || 0,
          });

          return Promise.resolve();
        }, Promise.resolve());

        PhotoManager.addSelected(recordId, assets);
        setSelectedPhotos(assets);
      }
    } catch (error) {
      toast.show(
        <ToastAlert
          status="info"
          title="Upload photo error"
          message="We ran into an error preparing photos for upload."
        />
      );
    } finally {
      setStatus("Idle");
    }
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
