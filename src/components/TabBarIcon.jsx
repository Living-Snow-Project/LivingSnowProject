import React from "react";
import { Platform } from "react-native";
import PropTypes from "prop-types";
import * as Icon from "@expo/vector-icons";
import Colors from "../constants/Colors";

const StockIcon = ({ name, size, style, color }) => (
  <Icon.Ionicons
    name={name}
    size={size ? size : 32}
    style={style}
    color={color ? color : Colors.tabIconDefault}
  />
);

StockIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
  color: PropTypes.string,
};

const RecordIcon = ({ type }) => {
  let name = Platform.OS === "ios" ? "ios-eye" : "md-eye";
  let color = "skyblue";

  if (type.includes("Sample")) {
    name = Platform.OS === "ios" ? "ios-flask" : "md-flask";
    color = "lightcoral";
  }

  return <StockIcon name={name} size={48} color={color} />;
};

RecordIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

const PictureIcon = () => (
  <StockIcon
    name={Platform.OS === "ios" ? "ios-image" : "md-image"}
    color={"green"}
    size={48}
  />
);

export { PictureIcon, RecordIcon, StockIcon };
