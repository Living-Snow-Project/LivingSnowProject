import React from "react";
import { Text, StyleProp, ViewStyle } from "react-native";

export function MonoText(props: MonotTextProps) {
  const { style } = props;
  return <Text {...props} style={[style, { fontFamily: "space-mono" }]} />;
}

type MonotTextProps = {
  style?: StyleProp<ViewStyle>;
};

MonoText.defaultProps = {
  style: undefined,
};
