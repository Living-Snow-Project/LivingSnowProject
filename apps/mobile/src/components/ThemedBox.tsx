import React from "react";
import { Box } from "native-base";

type ThemedBoxProps = {
  children: JSX.Element | JSX.Element[];
  [props: string]: any;
};

export function ThemedBox({ children, ...props }: ThemedBoxProps) {
  return (
    <Box {...props} _dark={{ bg: "dark.100" }}>
      {children}
    </Box>
  );
}
