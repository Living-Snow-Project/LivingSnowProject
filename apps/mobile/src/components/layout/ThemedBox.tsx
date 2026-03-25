import React from "react";
import { View } from "tamagui";

type ThemedBoxProps = {
  children: JSX.Element | JSX.Element[];
  [props: string]: any;
};

export function ThemedBox({ children, ...props }: ThemedBoxProps) {
  return (
    <View {...props} $theme-dark={{ backgroundColor: "#1A202C" }}>
      {children}
    </View>
  );
}
