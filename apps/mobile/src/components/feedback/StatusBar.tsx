import React, { useRef } from "react";
import { Animated } from "react-native";
import { Text, useColorModeValue, useTheme } from "native-base";
import { AlgaeRecordsStates } from "../../../types/AlgaeRecords";
import { Labels } from "../../constants/Strings";

type StatusBarProps = {
  state: AlgaeRecordsStates;
  isConnected: boolean;
};

export function StatusBar({ state, isConnected }: StatusBarProps) {
  const { colors } = useTheme();
  const startColor = useColorModeValue(
    colors.primary[400],
    colors.primary[600]
  );
  const endColor = useColorModeValue(colors.primary[500], colors.primary[700]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const color = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [startColor, endColor],
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
    ])
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
        backgroundColor: color,
      }}
    >
      <Text textAlign="center" fontWeight="semibold">
        {isConnected ? state : Labels.StatusBar.NoConnection}
      </Text>
    </Animated.View>
  );
}
