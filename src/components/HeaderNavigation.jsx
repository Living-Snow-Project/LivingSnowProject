import React from "react";
import { PropTypes } from "prop-types";
import { Platform, StyleSheet } from "react-native";
import PressableOpacity from "./PressableOpacity";
import { StockIcon } from "./TabBarIcon";

export default function HeaderButton({ iconName, onPress, placement }) {
  const marginWidth = 25;
  const style = StyleSheet.create(
    placement.includes("left") ? { left: marginWidth } : { right: marginWidth }
  );

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
