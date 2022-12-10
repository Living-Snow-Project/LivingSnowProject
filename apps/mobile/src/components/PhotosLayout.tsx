import React from "react";
import { Dimensions } from "react-native";
import { Box, HStack, Image, Text, VStack, useTheme } from "native-base";
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
  const halfScreenWidth = Math.ceil((screenWidth - theme.sizes[2]) / 2); // theme.sizes[2] is the # pixels behind Box px={2}
  const oneThirdScreenWidth = Math.ceil((screenWidth - theme.sizes[2]) / 3);
  const twoThirdScreenWidth = oneThirdScreenWidth + oneThirdScreenWidth;

  let portraitCount = 0;
  let landscapeCount = 0;

  // sort portrait to landscape and count number of each
  photos.forEach((current: Photo) => {
    if (current.height > current.width) {
      newPhotos.unshift({ ...current });
      portraitCount += 1;
    } else {
      newPhotos.push({ ...current });
      landscapeCount += 1;
    }
  });

  // assumes given 2 portrait or 2 landscape
  const renderSideBySide = (first: Photo, second: Photo) => {
    const { uri, width, height } = first;
    const fixedHeight = Math.floor(halfScreenWidth * (height / width));

    return (
      <HStack>
        <CachedPhoto uri={uri} width={halfScreenWidth} height={fixedHeight} />
        <Box pr={2} />
        <CachedPhoto
          uri={second.uri}
          width={halfScreenWidth}
          height={fixedHeight}
        />
      </HStack>
    );
  };

  const renderThreePortrait = (first: Photo, second: Photo, third: Photo) => {
    const { uri, width, height } = first;
    const controlHeight = Math.floor(twoThirdScreenWidth * (height / width));
    // account for <Box pt={2}/>
    const portraitHeight = Math.floor((controlHeight - theme.sizes[2]) / 2);

    return (
      <HStack>
        <CachedPhoto
          uri={uri}
          width={twoThirdScreenWidth}
          height={controlHeight}
        />
        <Box pr={2} />
        <VStack>
          <CachedPhoto
            uri={second.uri}
            width={oneThirdScreenWidth}
            height={portraitHeight}
          />
          <Box pt={2} />
          <CachedPhoto
            uri={third.uri}
            width={oneThirdScreenWidth}
            // account for floating point precision
            height={controlHeight - portraitHeight - theme.sizes[2]}
          />
        </VStack>
      </HStack>
    );
  };

  // default layout
  let renderLayout: JSX.Element = (
    <HStack justifyContent="space-evenly">
      {/* eslint-disable react/no-array-index-key */}
      {newPhotos.map((photo, index) => (
        <CachedPhoto key={index} uri={photo.uri} />
      ))}
    </HStack>
  );

  // app is restricted to 4 photos per record which results in 14 portrait\landscape combinations
  // combinations #1 and #2 - single photo, portrait or landscape
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

  // cominbations #3, #4, and #5
  if (newPhotos.length == 2) {
    if (portraitCount == 2 || landscapeCount == 2) {
      renderLayout = renderSideBySide(newPhotos[0], newPhotos[1]);
    } else {
      // 1 portrait and 1 landscape
      const { uri, width, height } = newPhotos[0];
      const fixedHeight = Math.floor(oneThirdScreenWidth * (height / width));

      renderLayout = (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={oneThirdScreenWidth}
            height={fixedHeight}
          />
          <Box pr={2} />
          <CachedPhoto
            uri={newPhotos[1].uri}
            width={twoThirdScreenWidth}
            height={fixedHeight}
          />
        </HStack>
      );
    }
  }

  // combinations #6, #7, #8, #9
  if (newPhotos.length == 3) {
    if (portraitCount == 3) {
      renderLayout = renderThreePortrait(
        newPhotos[0],
        newPhotos[1],
        newPhotos[2]
      );
    } else if (portraitCount == 2 /* && landscapeCount == 1 */) {
      renderLayout = (
        <>
          {renderSideBySide(newPhotos[0], newPhotos[1])}
          <Box pt={2} />
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width)
            )}
          />
        </>
      );
    } else if (portraitCount == 1 /* && landscapeCount == 2 */) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for <Box pt={2}/>
      const portraitHeight = Math.floor((controlHeight - theme.sizes[2]) / 2);

      return (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <Box pr={2} />
          <VStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={portraitHeight}
            />
            <Box pt={2} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - portraitHeight - theme.sizes[2]}
            />
          </VStack>
        </HStack>
      );
    } else if (landscapeCount == 3) {
      renderLayout = (
        <>
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width)
            )}
          />
          <Box pt={2} />
          {renderSideBySide(newPhotos[0], newPhotos[1])}
        </>
      );
    }
  }

  // combinations #10, #11, #12, #13, #14
  if (newPhotos.length == 4) {
    if (
      portraitCount == 4 ||
      landscapeCount == 4 ||
      (portraitCount == 2 && landscapeCount == 2)
    ) {
      renderLayout = (
        <>
          {renderSideBySide(newPhotos[0], newPhotos[1])}
          <Box pt={2} />
          {renderSideBySide(newPhotos[2], newPhotos[3])}
        </>
      );
    } else if (portraitCount == 1 && landscapeCount == 3) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for 2x <Box pt={2}/>
      const landscapeHeight = Math.floor(
        (controlHeight - 2 * theme.sizes[2]) / 3
      );

      renderLayout = (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <Box pr={2} />
          <VStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <Box pt={2} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <Box pt={2} />
            <CachedPhoto
              uri={newPhotos[3].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - 2 * (landscapeHeight + theme.sizes[2])}
            />
          </VStack>
        </HStack>
      );
    } else {
      // 3 portrait, 1 landscape
      renderLayout = (
        <>
          {renderThreePortrait(newPhotos[0], newPhotos[1], newPhotos[2])}
          <Box pt={2}>
            <CachedPhoto
              uri={newPhotos[3].uri}
              width={screenWidth}
              height={Math.floor(
                screenWidth * (newPhotos[3].height / newPhotos[3].width)
              )}
            />
          </Box>
        </>
      );
    }
  }

  return renderLayout;
}
