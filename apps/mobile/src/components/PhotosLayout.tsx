import React from "react";
import { Dimensions } from "react-native";
import { Box, HStack, Image, Text, useTheme } from "native-base";
import { Photo } from "@livingsnow/record";
import useCachedPhoto from "../hooks/useCachedPhotos";

// TODO: 1. copy/paste Cached Photo component for now, 2. width\height required when all layouts in, 3. make sure useCachedPhoto not downloading and useMemo likely
type CachedPhotoProps = {
  uri: string | number;
  width?: number;
  height?: number;
};

function CachedPhoto({ uri, width, height }: CachedPhotoProps) {
  const cachedPhoto = useCachedPhoto(uri);

  // require(...) scenario returns number
  // alternative is to write the file to disk on load but that duplicates data and needs a "resource manager"
  if (typeof cachedPhoto === "number") {
    return <Image source={cachedPhoto} />;
  }

  // TODO: what on earth was I thinking, these should be a separate state variable not recycled in the uri
  if (cachedPhoto.includes("Loading")) {
    return (
      <>
        <Text>{cachedPhoto}</Text>
        {/* <ActivityIndicator
          style={{ paddingTop: 5 }}
          size="large"
          color="lightgrey"
    /> */}
      </>
    );
  }

  if (cachedPhoto.includes("error") || cachedPhoto.includes("Offline")) {
    return (
      <>
        <Text>{cachedPhoto}</Text>
        {/* <PictureIcon /> */}
      </>
    );
  }

  // TODO: remove when all layouts completed
  const props = width && height ? { width, height } : { size: "md" };

  return (
    <Image {...props} source={{ uri: cachedPhoto }} alt="some alt text here" />
  );
}

type PhotosLayoutProps = {
  photos?: Photo[];
};

export default function PhotosLayout({
  photos,
}: PhotosLayoutProps): JSX.Element | null {
  const theme = useTheme();
  if (!photos || !photos.length) {
    return null;
  }

  const newPhotos: Photo[] = [];
  const { width: screenWidth } = Dimensions.get("screen");
  const halfScreen = Math.ceil((screenWidth - theme.sizes[2]) / 2); // Box px={2}
  const thirdScreen = Math.ceil((screenWidth - theme.sizes[2]) / 3);

  let portraitCount = 0;
  let landscapeCount = 0;

  // sort portait to landscape and count
  photos.forEach((current: Photo) => {
    if (current.height > current.width) {
      newPhotos.unshift({ ...current });
      portraitCount += 1;
    } else {
      newPhotos.push({ ...current });
      landscapeCount += 1;
    }
  });

  // default layout
  let renderLayout: JSX.Element = (
    <HStack justifyContent="space-evenly">
      {/* eslint-disable react/no-array-index-key */}
      {newPhotos.map((photo, index) => (
        <CachedPhoto key={index} uri={photo.uri} />
      ))}
    </HStack>
  );

  // we restrict the app to 4 photos per record which results in 14 combinations
  // #1 and #2 - single photo, portrait or landscape
  if (newPhotos.length == 1) {
    const { uri, width, height } = newPhotos[0];
    renderLayout = (
      <CachedPhoto
        uri={uri}
        width={screenWidth}
        height={Math.floor(screenWidth * (height / width))}
      />
    );
  }

  // #3, #4, and #5
  if (newPhotos.length == 2) {
    const { uri, width, height } = newPhotos[0];
    const { uri: uri2 } = newPhotos[1];

    if (portraitCount == 2 || landscapeCount == 2) {
      renderLayout = (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={halfScreen}
            height={Math.floor(halfScreen * (height / width))}
          />
          <Box pr={2} />
          <CachedPhoto
            uri={uri2}
            width={halfScreen}
            height={Math.floor(halfScreen * (height / width))}
          />
        </HStack>
      );
    } else {
      renderLayout = (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={thirdScreen}
            height={Math.floor(thirdScreen * (height / width))}
          />
          <Box pr={2} />
          <CachedPhoto
            uri={uri2}
            width={2 * thirdScreen}
            height={Math.floor(thirdScreen * (height / width))}
          />
        </HStack>
      );
    }
  }

  return renderLayout;
}
