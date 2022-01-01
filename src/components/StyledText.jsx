import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, Text } from "react-native";

export default function MonoText(props) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: "space-mono" }]} />;
}

MonoText.propTypes = {
  style: PropTypes.instanceOf(StyleSheet),
};

MonoText.defaultProps = {
  style: undefined,
};
