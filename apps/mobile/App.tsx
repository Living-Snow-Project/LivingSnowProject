import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import { ThemeProvider } from "./src/providers/Theme";
import { LanguageProvider } from "./src/providers/Language";
import { Navigation } from "./src/navigation/MainTabNavigator";
import { useCachedResources } from "./src/hooks/useCachedResources";
import {
  useAlgaeRecords,
  AlgaeRecordsContext,
} from "./src/hooks/useAlgaeRecords";
import { getAppSettings } from "./AppSettings";
import tamaguiConfig from "./tamagui.config";
import { ToastProvider } from "./src/components/feedback";
import i18n from "./src/i18n";

export function App() {
  const [algaeRecords] = useAlgaeRecords();
  const isLoadingComplete = useCachedResources();
  const [themeName, setThemeName] = useState<"light" | "dark">(
    getAppSettings().colorMode ?? "light",
  );
  const [language, setLanguage] = useState<string>(i18n.locale ?? "en");

  useEffect(() => {
    if (isLoadingComplete) {
      setLanguage(i18n.locale);
    }
  }, [isLoadingComplete]);

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
        <LanguageProvider value={{ language, setLanguage }}>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={themeName}>
            <ToastProvider>
              <Navigation key={language} />
              <StatusBar />
            </ToastProvider>
          </TamaguiProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AlgaeRecordsContext.Provider>
  );
}
