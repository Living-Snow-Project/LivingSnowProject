import React from "react";
import { View } from "tamagui";

type ThemedBoxProps = React.ComponentProps<typeof View>;

export function ThemedBox({ children, ...props }: ThemedBoxProps) {
  return (
    <View {...props} $theme-dark={{ backgroundColor: "#1A202C" }}>
      {children}
    </View>
  );
}
