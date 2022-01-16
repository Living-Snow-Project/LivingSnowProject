import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewPropTypes,
  ViewStyle,
} from "react-native";
import PropTypes from "prop-types";

type PressableOpacityProps = {
  onPress: (event: GestureResponderEvent) => void;
  style: StyleProp<ViewStyle>;
  children: JSX.Element;
};

export default function PressableOpacity({
  onPress,
  style = {},
  children,
}: PressableOpacityProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        style,
        {
          opacity: pressed ? 0.4 : 1.0,
        },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

PressableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  children: PropTypes.element.isRequired,
};

PressableOpacity.defaultProps = {
  style: {},
};
