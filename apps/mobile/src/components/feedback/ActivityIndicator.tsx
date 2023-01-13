import React from "react";
import { Dimensions } from "react-native";
import { Flex, Spinner, Text, useColorModeValue } from "native-base";

type ActivityIndicatorProps = {
  isActive: boolean;
  caption?: string;
};

export function ActivityIndicator({
  isActive,
  caption = "",
}: ActivityIndicatorProps) {
  const color = useColorModeValue("black", "white");
  const { height, width } = Dimensions.get("window");

  if (!isActive) {
    return null;
  }

  return (
    <>
      <Flex
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        opacity={0.65}
        _dark={{ bg: "dark.100" }}
        _light={{ bg: "dark.900" }}
      />
      <Flex
        position="absolute"
        alignItems="center"
        justifyContent="center"
        top={height / 2 - 100}
        left={width / 2 - 50}
        zIndex={2}
        w="100"
        h="100"
        shadow="9"
        opacity={0.95}
        borderRadius="4"
        _dark={{ bg: "dark.100" }}
        _light={{ bg: "dark.900" }}
      >
        <Spinner size="lg" color={color} />
        <Text fontSize="xl" color={color}>
          {caption}
        </Text>
      </Flex>
    </>
  );
}
