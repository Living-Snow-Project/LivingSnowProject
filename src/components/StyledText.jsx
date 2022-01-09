import React from "react";
import { Text, ViewPropTypes } from "react-native";

export default function MonoText(props) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: "space-mono" }]} />;
}

MonoText.propTypes = {
  style: ViewPropTypes.style,
};

MonoText.defaultProps = {
  style: undefined,
};
