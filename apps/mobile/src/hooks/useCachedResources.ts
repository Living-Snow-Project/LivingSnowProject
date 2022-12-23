import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Logger from "@livingsnow/logger";
import { loadAppConfig } from "../lib/Storage";
import { DefaultAppSettings, setAppSettings } from "../../AppSettings";

const spaceMono = require("../../assets/fonts/SpaceMono-Regular.ttf");

export function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // load app config
        const appSettings = await loadAppConfig();
        setAppSettings(appSettings === null ? DefaultAppSettings : appSettings);

        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": spaceMono,
        });
      } catch (e) {
        Logger.Warn(`${e}`);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
