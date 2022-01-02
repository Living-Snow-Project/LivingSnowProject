import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import Storage from "../lib/Storage";
import Logger from "../lib/Logger";

const spaceMono = require("../../assets/fonts/SpaceMono-Regular.ttf");

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync().catch((e) =>
          Logger.Warn(JSON.stringify(e))
        );

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": spaceMono,
        });

        // load app config
        await Storage.loadAppConfig();
      } catch (e) {
        Logger.Warn(JSON.stringify(e));
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
