import { saveAppConfig } from "./src/lib/Storage";
import { AppSettings } from "./types/AppSettings";

const DefaultAppSettings: AppSettings = {
  name: undefined,
  organization: undefined,
  showFirstRun: true,
  showGpsWarning: true,
  colorMode: "light",
};

let appSettingsContext: AppSettings = DefaultAppSettings;

function getAppSettings(): AppSettings {
  return appSettingsContext;
}

function setAppSettings(
  param: AppSettings | ((appSettings: AppSettings) => AppSettings)
): AppSettings {
  if (typeof param === "function") {
    appSettingsContext = param(appSettingsContext);
  } else {
    appSettingsContext = { ...param };
  }

  saveAppConfig(appSettingsContext);

  return appSettingsContext;
}

export { DefaultAppSettings, getAppSettings, setAppSettings };
