import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet } from "react-native";
import PressableOpacity from "./PressableOpacity";
import { StockIcon } from "./Icons";

type HeaderButtonProps = {
  iconName: string;
  onPress: () => void;
  placement: "left" | "right";
};

const marginWidth = 25;

const styles = StyleSheet.create({
  left: { left: marginWidth },
  right: { right: marginWidth },
});

export default function HeaderButton({
  iconName,
  onPress,
  placement,
}: HeaderButtonProps) {
  const style = placement.includes("left") ? styles.left : styles.right;

  return (
    <PressableOpacity style={style} onPress={() => onPress()}>
      <StockIcon
        name={Platform.OS === "ios" ? `ios-${iconName}` : `md-${iconName}`}
      />
    </PressableOpacity>
  );
}

HeaderButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  placement: PropTypes.string.isRequired,
};
