import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "tamagui";
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
  const theme = useTheme();

  return (
    <Ionicons
      name="add"
      size={50}
      color={theme.blue10.val}
      testID={TestIds.Icons.AddPhotosIcon}
    />
  );
}
export function PictureIcon() {
  return (
    <Ionicons
      name="image"
      size={24}
      color="green"
      testID={TestIds.Icons.PictureIcon}
    />
  );
}

export function SnowIcon() {
  return (
    <Ionicons
      name="snow"
      size={24}
      color="#ec4899"
      testID={TestIds.Icons.SnowIcon}
    />
  );
}
