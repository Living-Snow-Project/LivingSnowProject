import React, { createContext, useState } from "react";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import { NativeBaseProvider } from "./src/providers";
import { Navigation } from "./src/navigation/MainTabNavigator";
import { useCachedResources } from "./src/hooks/useCachedResources";
import {
  useAlgaeRecords,
  AlgaeRecordsContext,
} from "./src/hooks/useAlgaeRecords";
import { getAppSettings } from "./AppSettings";
import tamaguiConfig from "./tamagui.config";

type ThemeContextValue = {
  themeName: "light" | "dark";
  setThemeName: (value: "light" | "dark") => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  themeName: "light",
  setThemeName: () => {},
});

export function App() {
  const [algaeRecords] = useAlgaeRecords();
  const isLoadingComplete = useCachedResources();
  const [themeName, setThemeName] = useState<"light" | "dark">(
    getAppSettings().colorMode ?? "light",
  );

  if (
    algaeRecords.getCurrentState() !== "Seeding" &&
    !algaeRecords.isSeeded()
  ) {
    algaeRecords.seed();
  }

  if (!isLoadingComplete || !algaeRecords.isSeeded()) {
    return null;
  }

  Appearance.setColorScheme(getAppSettings().colorMode);

  return (
    <AlgaeRecordsContext.Provider value={algaeRecords}>
      <ThemeContext.Provider value={{ themeName, setThemeName }}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
          <NativeBaseProvider>
            <Navigation />
            <StatusBar />
          </NativeBaseProvider>
        </TamaguiProvider>
      </ThemeContext.Provider>
    </AlgaeRecordsContext.Provider>
  );
}