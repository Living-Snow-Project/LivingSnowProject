import React from "react";
import { Dimensions } from "react-native";
import { Spinner, Text, View } from "tamagui";

type ActivityIndicatorProps = {
  isActive: boolean;
  caption?: string;
};

export function ActivityIndicator({
  isActive,
  caption = "",
}: ActivityIndicatorProps) {
  const { height, width } = Dimensions.get("window");

  if (!isActive) {
    return null;
  }

  return (
    <>
      <View
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        opacity={0.65}
        $theme-dark={{ backgroundColor: "$backgroundStrong" }}
        $theme-light={{ backgroundColor: "$backgroundStrong" }}
      />
      <View
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top={height / 2 - 100}
        left={width / 2 - 50}
        zIndex={2}
        width={100}
        height={100}
        opacity={0.95}
        borderRadius="$2"
        $theme-dark={{ backgroundColor: "$backgroundStrong" }}
        $theme-light={{ backgroundColor: "$backgroundStrong" }}
      >
        <Spinner size="large" color="$color" />
        <Text fontSize="$6" color="$color">
          {caption}
        </Text>
      </View>
    </>
  );
}