import React from "react";

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
  updateAppSettings: (appSettings) => void;
};

const DefaultAppSettings: AppSettings = {
  name: undefined,
  organization: undefined,
  showFirstRun: true,
  showGpsWarning: true,
  showAtlasRecords: false,
  showOnlyAtlasRecords: false,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  updateAppSettings: (appSettings) => {},
};

const AppSettingsContext = React.createContext<AppSettings>(DefaultAppSettings);

export { AppSettings, AppSettingsContext, DefaultAppSettings };
