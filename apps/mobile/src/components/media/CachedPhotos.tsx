import React from "react";
import { Dimensions } from "react-native";
import { Image, Spinner, Paragraph, View } from "tamagui";
import { Photo } from "@livingsnow/record";
import { useCachedPhoto } from "../../hooks/useCachedPhotos";
import { PictureIcon } from "./Icons";

type CachedPhotoProps = {
  uri: string | number;
  width: number;
  height: number;
};

// used by PhotosLayout and RecordDetailsScreen
function CachedPhoto({
  uri,
  width,
  height,
}: CachedPhotoProps): React.JSX.Element {
  const cachedPhoto = useCachedPhoto({ uri, width, height });

  // require(...) scenario returns number
  // alternative is to write the file to disk on load but that duplicates data and needs a "resource manager"
  if (typeof cachedPhoto.uri == "number") {
    return (
      <Image
        width={width}
        height={height}
        src={cachedPhoto.uri as unknown as string}
      />
    );
  }

  if (cachedPhoto.state == "Loading" || cachedPhoto.state == "Downloading") {
    return (
      <View
        width={width}
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="large" />
        <Paragraph>{cachedPhoto.state}</Paragraph>
      </View>
    );
  }

  if (cachedPhoto.state == "Error" || cachedPhoto.state == "Offline") {
    return (
      <View
        width={width}
        height={height}
        alignItems="center"
        justifyContent="center"
      >
        <Paragraph>{cachedPhoto.state}</Paragraph>
        <PictureIcon />
      </View>
    );
  }

  return <Image width={width} height={height} src={cachedPhoto.uri} />;
}

type CachedPhotosProps = {
  photos?: Photo[];
};

// only used by RecordDetailsScreen
function CachedPhotos({ photos }: CachedPhotosProps): React.JSX.Element | null {
  if (!photos || !photos.length) {
    return null;
  }

  const { width } = Dimensions.get("screen");

  return (
    <>
      {photos.map((photo, index) => (
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
