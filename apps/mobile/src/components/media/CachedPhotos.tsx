import React from "react";
import { Dimensions } from "react-native";
import { Box, Image, Spinner, Text } from "native-base";
import { Photo } from "@livingsnow/record";
import { useCachedPhoto } from "../../hooks/useCachedPhotos";
import { PictureIcon } from "./Icons";

type CachedPhotoProps = {
  uri: string | number;
  width: number;
  height: number;
};

// used by PhotosLayout and RecordDetailsScreen
function CachedPhoto({ uri, width, height }: CachedPhotoProps): JSX.Element {
  const cachedPhoto = useCachedPhoto({ uri, width, height });

  // require(...) scenario returns number
  // alternative is to write the file to disk on load but that duplicates data and needs a "resource manager"
  if (typeof cachedPhoto.uri == "number") {
    return (
      <Image
        width={width}
        height={height}
        source={cachedPhoto.uri}
        alt="static image"
      />
    );
  }

  if (cachedPhoto.state == "Loading" || cachedPhoto.state == "Downloading") {
    return (
      <Box
        width={width}
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="large" />
        <Text>{cachedPhoto.state}</Text>
      </Box>
    );
  }

  if (cachedPhoto.state == "Error" || cachedPhoto.state == "Offline") {
    return (
      <Box
        width={width}
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <Text>{cachedPhoto.state}</Text>
        <PictureIcon />
      </Box>
    );
  }

  return (
    <Image
      width={width}
      height={height}
      source={{ uri: cachedPhoto.uri }}
      alt={cachedPhoto.state}
    />
  );
}

type CachedPhotosProps = {
  photos?: Photo[];
};

// only used by RecordDetailsScreen
function CachedPhotos({ photos }: CachedPhotosProps): JSX.Element | null {
  if (!photos || !photos.length) {
    return null;
  }

  const { width } = Dimensions.get("screen");

  return (
    <>
      {photos.map((photo, index) => (
        /* eslint-disable react/no-array-index-key */
        <CachedPhoto
          key={index}
          uri={photo.uri}
          width={width}
          height={Math.floor(width * (photo.height / photo.width))}
        />
      ))}
    </>
  );
}

export { CachedPhoto, CachedPhotos };
