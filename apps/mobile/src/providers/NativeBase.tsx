import React from "react";
import { extendTheme, NativeBaseProvider } from "native-base";

type NativeBaseProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export default function NativeBaseProviderWrapper({
  children,
}: NativeBaseProviderProps) {
  const theme = extendTheme({
    components: {
      Box: {
        baseStyle: () => ({
          _dark: { bgColor: "dark.100" },
        }),
      },
    },
  });

  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
}
