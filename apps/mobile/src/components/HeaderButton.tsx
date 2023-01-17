import React from "react";
import { Platform } from "react-native";
import { Pressable, useColorModeValue, useTheme } from "native-base";
import { StockIcon } from "./Icons";

type IconNames =
  | "snow"
  | "save-outline"
  | "cloud-upload"
  | "settings-outline"
  | "add-circle-outline"
  | "checkmark-circle-outline";

type HeaderButtonProps = {
  testID: string;
  iconName: IconNames;
  onPress: () => void;
  placement: "left" | "right";
};

export function HeaderButton({
  testID,
  iconName,
  onPress,
  placement,
}: HeaderButtonProps) {
  const style =
    placement == "left"
      ? {
          ml: "6",
        }
      : {
          mr: "6",
        };
  const theme = useTheme();
  const color = useColorModeValue(
    theme.colors.primary[600],
    theme.colors.primary[400]
  );

  return (
    <Pressable {...style} testID={testID} onPress={onPress}>
      <StockIcon
        name={Platform.OS == "ios" ? `ios-${iconName}` : `md-${iconName}`}
        testID={`${testID}-${iconName}`}
        color={color}
      />
    </Pressable>
  );
}
