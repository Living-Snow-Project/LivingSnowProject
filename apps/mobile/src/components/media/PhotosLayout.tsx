import React from "react";
import { Dimensions } from "react-native";
import { Box, HStack, VStack, useTheme } from "native-base";
import { AppPhoto } from "@livingsnow/record";
import { SelectedPhoto } from "../../../types";
import { CachedPhoto } from "./CachedPhotos";

type PhotosLayoutProps = {
  photos?: AppPhoto[] | SelectedPhoto[];
};

const gap = 1.5;

export function PhotosLayout({
  photos,
}: PhotosLayoutProps): JSX.Element | null {
  const theme = useTheme();

  if (!photos || !photos.length) {
    return null;
  }

  const newPhotos: AppPhoto[] = [];
  const { width: screenWidth } = Dimensions.get("screen");
  const halfScreenWidth = Math.ceil((screenWidth - theme.sizes[gap]) / 2);
  const oneThirdScreenWidth = Math.ceil((screenWidth - theme.sizes[gap]) / 3);
  const twoThirdScreenWidth = oneThirdScreenWidth + oneThirdScreenWidth;

  let portraitCount = 0;
  let landscapeCount = 0;

  // sort portrait to landscape and count number of each
  photos.forEach((current: AppPhoto | SelectedPhoto) => {
    if (current.height > current.width) {
      newPhotos.unshift({ ...current, size: 0 });
      portraitCount += 1;
    } else {
      newPhotos.push({ ...current, size: 0 });
      landscapeCount += 1;
    }
  });

  // assumes given 2 portrait or 2 landscape
  const renderSideBySide = (first: AppPhoto, second: AppPhoto) => {
    const { uri, width, height } = first;
    const fixedHeight = Math.floor(halfScreenWidth * (height / width));

    return (
      <HStack>
        <CachedPhoto uri={uri} width={halfScreenWidth} height={fixedHeight} />
        <Box pr={gap} />
        <CachedPhoto
          uri={second.uri}
          width={halfScreenWidth}
          height={fixedHeight}
        />
      </HStack>
    );
  };

  const renderThreePortrait = (
    first: AppPhoto,
    second: AppPhoto,
    third: AppPhoto
  ) => {
    const { uri, width, height } = first;
    const controlHeight = Math.floor(twoThirdScreenWidth * (height / width));
    // account for <Box pt={gap}/>
    const portraitHeight = Math.floor((controlHeight - theme.sizes[gap]) / 2);

    return (
      <HStack>
        <CachedPhoto
          uri={uri}
          width={twoThirdScreenWidth}
          height={controlHeight}
        />
        <Box pr={gap} />
        <VStack>
          <CachedPhoto
            uri={second.uri}
            width={oneThirdScreenWidth}
            height={portraitHeight}
          />
          <Box pt={gap} />
          <CachedPhoto
            uri={third.uri}
            width={oneThirdScreenWidth}
            // account for floating point precision
            height={controlHeight - portraitHeight - theme.sizes[gap]}
          />
        </VStack>
      </HStack>
    );
  };

  // app is restricted to 4 photos per record which results in 14 portrait\landscape combinations
  // combinations #1 and #2 - single photo, portrait or landscape
  if (newPhotos.length == 1) {
    const { uri, width, height } = newPhotos[0];
    return (
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
      return renderSideBySide(newPhotos[0], newPhotos[1]);
    }

    // 1 portrait and 1 landscape
    const { uri, width, height } = newPhotos[0];
    const fixedHeight = Math.floor(oneThirdScreenWidth * (height / width));

    return (
      <HStack>
        <CachedPhoto
          uri={uri}
          width={oneThirdScreenWidth}
          height={fixedHeight}
        />
        <Box pr={gap} />
        <CachedPhoto
          uri={newPhotos[1].uri}
          width={twoThirdScreenWidth}
          height={fixedHeight}
        />
      </HStack>
    );
  }

  // combinations #6, #7, #8, #9
  if (newPhotos.length == 3) {
    if (portraitCount == 3) {
      return renderThreePortrait(newPhotos[0], newPhotos[1], newPhotos[2]);
    }

    if (portraitCount == 2 /* && landscapeCount == 1 */) {
      return (
        <>
          {renderSideBySide(newPhotos[0], newPhotos[1])}
          <Box pt={gap} />
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width)
            )}
          />
        </>
      );
    }

    if (portraitCount == 1 /* && landscapeCount == 2 */) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for <Box pt={gap}/>
      const portraitHeight = Math.floor((controlHeight - theme.sizes[gap]) / 2);

      return (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <Box pr={gap} />
          <VStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={portraitHeight}
            />
            <Box pt={gap} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - portraitHeight - theme.sizes[gap]}
            />
          </VStack>
        </HStack>
      );
    }

    if (landscapeCount == 3) {
      return (
        <>
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width)
            )}
          />
          <Box pt={gap} />
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
      return (
        <>
          {renderSideBySide(newPhotos[0], newPhotos[1])}
          <Box pt={gap} />
          {renderSideBySide(newPhotos[2], newPhotos[3])}
        </>
      );
    }

    if (portraitCount == 1 && landscapeCount == 3) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for 2x <Box pt={gap}/>
      const landscapeHeight = Math.floor(
        (controlHeight - 2 * theme.sizes[gap]) / 3
      );

      return (
        <HStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <Box pr={gap} />
          <VStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <Box pt={gap} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <Box pt={gap} />
            <CachedPhoto
              uri={newPhotos[3].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - 2 * (landscapeHeight + theme.sizes[gap])}
            />
          </VStack>
        </HStack>
      );
    }

    // 3 portrait, 1 landscape
    return (
      <>
        {renderThreePortrait(newPhotos[0], newPhotos[1], newPhotos[2])}
        <Box pt={gap}>
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

  return null;
}
