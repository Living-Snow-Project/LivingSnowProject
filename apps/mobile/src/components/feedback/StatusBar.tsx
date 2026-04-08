import React, { useRef } from "react";
import { Animated } from "react-native";
import { Text, useTheme } from "tamagui";
import { AlgaeRecordsStates } from "../../../types/AlgaeRecords";
import { Labels } from "../../constants/Strings";

type StatusBarProps = {
  state: AlgaeRecordsStates;
  isConnected: boolean;
};

export function StatusBar({ state, isConnected }: StatusBarProps) {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundColor = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.blue8.val, theme.blue10.val],
  });

  const animate = Animated.loop(
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]),
  );

  if (state == "Idle") {
    animate.stop();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  } else {
    animate.start();
  }

  return (
    <Animated.View
      style={{
        backgroundColor,
      }}
    >
      <Text textAlign="center" fontWeight="600">
        {isConnected ? state : Labels.StatusBar.NoConnection}
      </Text>
    </Animated.View>
  );
}
