import React from "react";
import { Platform, StyleSheet } from "react-native";
import PressableOpacity from "./PressableOpacity";
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

const marginWidth = 25;

const styles = StyleSheet.create({
  left: { left: marginWidth },
  right: { right: marginWidth },
});

export default function HeaderButton({
  testID,
  iconName,
  onPress,
  placement,
}: HeaderButtonProps) {
  const style = placement.includes("left") ? styles.left : styles.right;

  return (
    <PressableOpacity testID={testID} style={style} onPress={() => onPress()}>
      <StockIcon
        name={Platform.OS === "ios" ? `ios-${iconName}` : `md-${iconName}`}
        testID={iconName}
      />
    </PressableOpacity>
  );
}
