import React from "react";
import { NativeBaseProvider, StorageManager } from "native-base";
import { getAppSettings, setAppSettings } from "../../AppSettings";

export const colorModeManager: StorageManager = {
  get: async () => {
    const { colorMode } = getAppSettings();

    return colorMode ?? "light";
  },

  set: async (value: "light" | "dark") =>
    setAppSettings((prev) => ({ ...prev, colorMode: value })),
};

type NativeBaseProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export function NativeBaseProviderWrapper({
  children,
}: NativeBaseProviderProps) {
  return (
    <NativeBaseProvider colorModeManager={colorModeManager}>
      {children}
    </NativeBaseProvider>
  );
}
