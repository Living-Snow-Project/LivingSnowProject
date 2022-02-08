import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet } from "react-native";
import PressableOpacity from "./PressableOpacity";
import { StockIcon } from "./Icons";

type HeaderButtonProps = {
  testID: string;
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

HeaderButton.propTypes = {
  testID: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  placement: PropTypes.string.isRequired,
};

HeaderButton.defaultProps = {
  testID: "",
};
