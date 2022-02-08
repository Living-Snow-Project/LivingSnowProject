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
  testID: string;
  onPress: (event: GestureResponderEvent) => void;
  style: StyleProp<ViewStyle>;
  children: JSX.Element;
  testOnly_pressed: boolean;
};

export default function PressableOpacity({
  testID,
  onPress,
  style,
  children,
  testOnly_pressed,
}: PressableOpacityProps) {
  return (
    <Pressable
      testOnly_pressed={testOnly_pressed}
      testID={testID}
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
  testID: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
  children: PropTypes.element.isRequired,
  testOnly_pressed: PropTypes.bool,
};

PressableOpacity.defaultProps = {
  testID: "",
  style: {},
  testOnly_pressed: false,
};
