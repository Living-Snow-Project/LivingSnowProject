import React from "react";
import { Platform } from "react-native";
import { useColorModeValue, useTheme } from "native-base";
import { PressableOpacity } from "../PressableOpacity";
import { StockIcon } from "../media";

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
          marginLeft: 25,
        }
      : {
          marginRight: 25,
        };
  const theme = useTheme();
  const color = useColorModeValue(
    theme.colors.primary[600],
    theme.colors.primary[400]
  );

  return (
    <PressableOpacity style={style} testID={testID} onPress={onPress}>
      <StockIcon
        name={iconName}
        testID={`${testID}-${iconName}`}
        color={color}
      />
    </PressableOpacity>
  );
}
