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

function setAppSettings(appSettings: AppSettings): void {
  appSettingsContext = { ...appSettingsContext, ...appSettings };
  Storage.saveAppConfig(appSettingsContext);
}

export { AppSettings, DefaultAppSettings, getAppSettings, setAppSettings };
