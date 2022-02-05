import Storage from "./src/lib/Storage";

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
};

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

  Storage.saveAppConfig(appSettingsContext);
}

export { AppSettings, DefaultAppSettings, getAppSettings, setAppSettings };
