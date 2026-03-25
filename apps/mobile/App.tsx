import React from "react";
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

export function App() {
  const [algaeRecords] = useAlgaeRecords();
  const isLoadingComplete = useCachedResources();

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
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={getAppSettings().colorMode}
      >
        <NativeBaseProvider>
          <Navigation />
          <StatusBar />
        </NativeBaseProvider>
      </TamaguiProvider>
    </AlgaeRecordsContext.Provider>
  );
}
