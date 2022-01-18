import React from "react";
import { Platform, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import * as Icon from "@expo/vector-icons";
import Colors from "../constants/Colors";
import * as Record from "../record/Record";

function StockIcon({ name, size, style, color }) {
  return <Icon.Ionicons name={name} size={size} style={style} color={color} />;
}

StockIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: ViewPropTypes.style,
  color: PropTypes.string,
};

StockIcon.defaultProps = {
  size: 32,
  style: undefined,
  color: Colors.tabIconDefault,
};

function RecordIcon({ type }: { type: Record.RecordType }) {
  let name = Platform.OS === "ios" ? "ios-eye" : "md-eye";
  let color = "skyblue";

  if (Record.isSample(type)) {
    name = Platform.OS === "ios" ? "ios-flask" : "md-flask";
    color = "lightcoral";
  }

  return <StockIcon name={name} size={48} color={color} />;
}

RecordIcon.propTypes = {
  type: PropTypes.oneOf(Object.values(Record.RecordType)).isRequired,
};

function PictureIcon() {
  return (
    <StockIcon
      name={Platform.OS === "ios" ? "ios-image" : "md-image"}
      color="green"
      size={48}
    />
  );
}

export { PictureIcon, RecordIcon, StockIcon };
