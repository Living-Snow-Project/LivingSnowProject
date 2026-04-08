import React from "react";
import { Dimensions } from "react-native";
import { View, XStack, YStack } from "tamagui";
import { Photo } from "@livingsnow/record";
import { CachedPhoto } from "./CachedPhotos";

type PhotosLayoutProps = {
  photos?: Photo[];
};

// NativeBase sizes[1.5] = 6px (base-4 scale)
const gapPx = 6;

export function PhotosLayout({
  photos,
}: PhotosLayoutProps): React.JSX.Element | null {
  if (!photos || !photos.length) {
    return null;
  }

  const newPhotos: Photo[] = [];
  const { width: screenWidth } = Dimensions.get("screen");
  const halfScreenWidth = Math.ceil((screenWidth - gapPx) / 2);
  const oneThirdScreenWidth = Math.ceil((screenWidth - gapPx) / 3);
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
      <XStack>
        <CachedPhoto uri={uri} width={halfScreenWidth} height={fixedHeight} />
        <View width={gapPx} />
        <CachedPhoto
          uri={second.uri}
          width={halfScreenWidth}
          height={fixedHeight}
        />
      </XStack>
    );
  };

  const renderThreePortrait = (first: Photo, second: Photo, third: Photo) => {
    const { uri, width, height } = first;
    const controlHeight = Math.floor(twoThirdScreenWidth * (height / width));
    // account for <View height={gapPx}/>
    const portraitHeight = Math.floor((controlHeight - gapPx) / 2);

    return (
      <XStack>
        <CachedPhoto
          uri={uri}
          width={twoThirdScreenWidth}
          height={controlHeight}
        />
        <View width={gapPx} />
        <YStack>
          <CachedPhoto
            uri={second.uri}
            width={oneThirdScreenWidth}
            height={portraitHeight}
          />
          <View height={gapPx} />
          <CachedPhoto
            uri={third.uri}
            width={oneThirdScreenWidth}
            // account for floating point precision
            height={controlHeight - portraitHeight - gapPx}
          />
        </YStack>
      </XStack>
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
      <XStack>
        <CachedPhoto
          uri={uri}
          width={oneThirdScreenWidth}
          height={fixedHeight}
        />
        <View width={gapPx} />
        <CachedPhoto
          uri={newPhotos[1].uri}
          width={twoThirdScreenWidth}
          height={fixedHeight}
        />
      </XStack>
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
          <View height={gapPx} />
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width),
            )}
          />
        </>
      );
    }

    if (portraitCount == 1 /* && landscapeCount == 2 */) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for <View height={gapPx}/>
      const portraitHeight = Math.floor((controlHeight - gapPx) / 2);

      return (
        <XStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <View width={gapPx} />
          <YStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={portraitHeight}
            />
            <View height={gapPx} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - portraitHeight - gapPx}
            />
          </YStack>
        </XStack>
      );
    }

    if (landscapeCount == 3) {
      return (
        <>
          <CachedPhoto
            uri={newPhotos[2].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[2].height / newPhotos[2].width),
            )}
          />
          <View height={gapPx} />
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
          <View height={gapPx} />
          {renderSideBySide(newPhotos[2], newPhotos[3])}
        </>
      );
    }

    if (portraitCount == 1 && landscapeCount == 3) {
      const { uri, width, height } = newPhotos[0];
      const controlHeight = Math.floor(halfScreenWidth * (height / width));
      // account for 2x <View height={gapPx}/>
      const landscapeHeight = Math.floor(
        (controlHeight - 2 * gapPx) / 3,
      );

      return (
        <XStack>
          <CachedPhoto
            uri={uri}
            width={halfScreenWidth}
            height={controlHeight}
          />
          <View width={gapPx} />
          <YStack>
            <CachedPhoto
              uri={newPhotos[1].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <View height={gapPx} />
            <CachedPhoto
              uri={newPhotos[2].uri}
              width={halfScreenWidth}
              height={landscapeHeight}
            />
            <View height={gapPx} />
            <CachedPhoto
              uri={newPhotos[3].uri}
              width={halfScreenWidth}
              // account for floating point precision
              height={controlHeight - 2 * (landscapeHeight + gapPx)}
            />
          </YStack>
        </XStack>
      );
    }

    // 3 portrait, 1 landscape
    return (
      <>
        {renderThreePortrait(newPhotos[0], newPhotos[1], newPhotos[2])}
        <View paddingTop={gapPx}>
          <CachedPhoto
            uri={newPhotos[3].uri}
            width={screenWidth}
            height={Math.floor(
              screenWidth * (newPhotos[3].height / newPhotos[3].width),
            )}
          />
        </View>
      </>
    );
  }

  return null;
}
