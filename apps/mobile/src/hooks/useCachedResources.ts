import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { getLocales } from "expo-localization";
import Logger from "@livingsnow/logger";
import { loadAppConfig } from "../lib/Storage";
import { DefaultAppSettings, setAppSettings } from "../../AppSettings";
import i18n, { SUPPORTED_LOCALES } from "../i18n";

export function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // load app config
        const appSettings = await loadAppConfig();
        const resolved = appSettings === null ? DefaultAppSettings : appSettings;
        setAppSettings(resolved);

        // resolve locale: saved preference → device locale (if supported) → "en"
        const deviceLocale = getLocales()[0].languageCode ?? "en";
        const locale =
          (resolved.language && SUPPORTED_LOCALES.includes(resolved.language))
            ? resolved.language
            : SUPPORTED_LOCALES.includes(deviceLocale)
              ? deviceLocale
              : "en";
        i18n.locale = locale;

        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          Inter: require("@tamagui/font-inter/otf/Inter-Regular.otf"),
          Inter_500: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
          InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
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
