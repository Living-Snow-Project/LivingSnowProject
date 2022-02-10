import { saveAppConfig } from "./src/lib/Storage";
import { AppSettings } from "./@types/AppSettings";

const DefaultAppSettings: AppSettings = {
  name: undefined,
  organization: undefined,
  showFirstRun: true,
  showGpsWarning: true,
  showAtlasRecords: false,
  showOnlyAtlasRecords: false,
};

let appSettingsContext: AppSettings = DefaultAppSettings;

function getAppSettings(): AppSettings {
  return appSettingsContext;
}

function setAppSettings(
  param: AppSettings | ((appSettings: AppSettings) => AppSettings)
): void {
  if (typeof param === "function") {
    appSettingsContext = param(appSettingsContext);
  } else {
    appSettingsContext = param;
  }

  saveAppConfig(appSettingsContext);
}

export { AppSettings, DefaultAppSettings, getAppSettings, setAppSettings };
