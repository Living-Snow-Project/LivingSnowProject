import React from "react";
// TODO: use NativeBase for all layouts
import { ActivityIndicator, Dimensions, Text } from "react-native";
import { Image } from "native-base";
import { Photo } from "@livingsnow/record";
import { useCachedPhoto } from "../hooks/useCachedPhotos";
import { PictureIcon } from "./Icons";

type CachedPhotoProps = {
  uri: string | number;
  width: number;
  height: number;
};

function CachedPhoto({ uri, width, height }: CachedPhotoProps): JSX.Element {
  const cachedPhoto = useCachedPhoto({ uri, width, height });

  // require(...) scenario returns number
  // alternative is to write the file to disk on load but that duplicates data and needs a "resource manager"
  if (typeof cachedPhoto.uri == "number") {
    return <Image source={cachedPhoto.uri} alt="static image" />;
  }

  if (cachedPhoto.state == "Loading" || cachedPhoto.state == "Downloading") {
    return (
      <>
        <Text>{cachedPhoto.state}</Text>
        <ActivityIndicator
          style={{ paddingTop: 5 }}
          size="large"
          color="lightgrey"
        />
      </>
    );
  }

  if (cachedPhoto.state == "Error" || cachedPhoto.state == "Offline") {
    return (
      <>
        <Text>{cachedPhoto.state}</Text>
        <PictureIcon />
      </>
    );
  }

  return (
    <Image
      width={width}
      height={height}
      source={{ uri: cachedPhoto.uri }}
      alt="some alt text here"
    />
  );
}

type CachedPhotosProps = {
  photos?: Photo[];
};

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
