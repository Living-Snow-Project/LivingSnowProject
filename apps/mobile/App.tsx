import React, { useState } from "react";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import { ThemeProvider } from "./src/providers/Theme";
import { Navigation } from "./src/navigation/MainTabNavigator";
import { useCachedResources } from "./src/hooks/useCachedResources";
import {
  useAlgaeRecords,
  AlgaeRecordsContext,
} from "./src/hooks/useAlgaeRecords";
import { getAppSettings } from "./AppSettings";
import tamaguiConfig from "./tamagui.config";
import { ToastProvider } from "./src/components/feedback";

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
      <ThemeProvider value={{ themeName, setThemeName }}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
          <ToastProvider>
            <Navigation />
            <StatusBar />
          </ToastProvider>
        </TamaguiProvider>
      </ThemeProvider>
    </AlgaeRecordsContext.Provider>
  );
}
