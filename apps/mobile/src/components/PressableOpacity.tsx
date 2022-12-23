import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

type PressableOpacityProps = {
  testID?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  children: JSX.Element;
  testOnly_pressed?: boolean;
};

export function PressableOpacity({
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

PressableOpacity.defaultProps = {
  testID: "",
  style: {},
  testOnly_pressed: false,
};
