import React from "react";
import { useTheme } from "tamagui";
import { PressableOpacity } from "../PressableOpacity";
import { StockIcon } from "../media";

type IconNames =
  | "snow"
  | "save-outline"
  | "cloud-upload"
  | "settings-outline"
  | "add-circle-outline"
  | "checkmark-circle-outline"
  | "map-outline";

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
  const color = theme.blue10.val;

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
