import React, { useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Labels } from "../constants/Strings";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});

type StatusBarProps = {
  state: RecordReducerStates;
  isConnected: boolean;
};

export default function StatusBar({ state, isConnected }: StatusBarProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const currentState = useRef(state);
  const color = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(211, 211, 211)", "rgb(155, 155, 155)"],
  });

  currentState.current = state;

  const animate = () => {
    isAnimating.current = true;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        isAnimating.current = false;
        if (currentState.current !== "Idle") {
          animate();
        }
      });
    });
  };

  if (state !== "Idle" && !isAnimating.current) {
    animate();
  }

  return (
    <Animated.View
      style={{
        borderBottomWidth: 1,
        backgroundColor: color,
      }}
    >
      <Text style={styles.text}>
        {isConnected ? state : Labels.StatusBar.NoConnection}
      </Text>
    </Animated.View>
  );
}
