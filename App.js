/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation/MainTabNavigator";
import useCachedResources from "./src/hooks/useCachedResources";
import { AppSettingsContext } from "./AppSettings";
import Storage from "./src/lib/Storage";

export default function App() {
  const { isLoadingComplete, appSettings, setAppSettings } =
    useCachedResources();

  if (!isLoadingComplete) {
    return null;
  }

  appSettings.updateAppSettings = (newSettings) => {
    setAppSettings((prevSettings) => {
      const mergedSettings = { ...prevSettings, ...newSettings };
      Storage.saveAppConfig(mergedSettings);
      return mergedSettings;
    });
  };

  return (
    <SafeAreaProvider>
      <AppSettingsContext.Provider value={appSettings}>
        <Navigation />
      </AppSettingsContext.Provider>
      <StatusBar />
    </SafeAreaProvider>
  );
}
