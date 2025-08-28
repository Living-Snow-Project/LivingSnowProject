import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { AddIcon, Icon, useColorModeValue } from "native-base";
import { Colors, TestIds } from "../../constants";

type StockIconProps = {
  name: IconNameType;
  size?: number;
  color?: string;
  testID: string;
};

export function StockIcon({
  name,
  size = 32,
  color = Colors.tabIconDefault,
  testID,
}: StockIconProps) {
  return <Ionicons name={name} size={size} color={color} testID={testID} />;
}

type IconNameType = keyof typeof Ionicons.glyphMap;

export function AddPhotosIcon() {
  const color = useColorModeValue("primary.600", "primary.400");

  return (
    <AddIcon color={color} size="50" testID={TestIds.Icons.AddPhotosIcon} />
  );
}
export function PictureIcon() {
  return (
    <Icon
      as={Ionicons}
      color="green"
      name="image"
      size="xl"
      testID={TestIds.Icons.PictureIcon}
    />
  );
}

export function SnowIcon() {
  return (
    <Icon
      as={Ionicons}
      color="pink.500"
      name="snow"
      size="xl"
      testID={TestIds.Icons.SnowIcon}
    />
  );
}
