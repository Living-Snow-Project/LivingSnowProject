import React from "react";
import { Pressable } from "react-native";
import PropTypes from "prop-types";

export default function PressableOpacity({ onPress, children }) {
  return (
    <Pressable
      style={({ pressed }) => [
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
  children: PropTypes.element.isRequired,
};
