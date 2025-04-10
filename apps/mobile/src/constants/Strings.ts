import i18n from "../i18n";

export const Placeholders = {
  GPS: {
    get AcquiringLocation(): string {
      return i18n.t("placeholders.gps.acquiringLocation");
    },
    get EnterCoordinates(): string {
      return i18n.t("placeholders.gps.enterCoordinates");
    },
    get NoPermissions(): string {
      return i18n.t("placeholders.gps.noPermissions");
    },
    get NoLocation(): string {
      return i18n.t("placeholders.gps.noLocation");
    },
  },
  Settings: {
    get Username(): string {
      return i18n.t("placeholders.settings.username");
    },
    get Organization(): string {
      return i18n.t("placeholders.settings.organization");
    },
  },
  RecordScreen: {
    get LocationDescription(): string {
      return i18n.t("placeholders.recordScreen.locationDescription");
    },
    get Notes(): string {
      return i18n.t("placeholders.recordScreen.notes");
    },
    get Size(): string {
      return i18n.t("placeholders.recordScreen.size");
    },
    get Other(): string {
      return i18n.t("placeholders.recordScreen.other");
    },
    get TubeId(): string {
      return i18n.t("placeholders.recordScreen.tubeId");
    },
    get TubeIdDisabled(): string {
      return i18n.t("placeholders.recordScreen.tubeIdDisabled");
    },
  },
};

export const Labels = {
  get Date(): string {
    return i18n.t("labels.date");
  },
  get DefaultName(): string {
    return i18n.t("labels.defaultName");
  },
  get Empty(): string {
    return i18n.t("labels.empty");
  },
  get LivingSnowProject(): string {
    return i18n.t("labels.livingSnowProject");
  },
  get Name(): string {
    return i18n.t("labels.name");
  },
  get Organization(): string {
    return i18n.t("labels.organization");
  },
  get Photos(): string {
    return i18n.t("labels.photos");
  },
  get RecordType(): string {
    return i18n.t("labels.recordType");
  },
  get Slogan(): string {
    return i18n.t("labels.slogan");
  },
  get TubeId(): string {
    return i18n.t("labels.tubeId");
  },
  FirstRunScreen: {
    get StartReporting(): string {
      return i18n.t("labels.firstRunScreen.startReporting");
    },
    get Usage(): string {
      return i18n.t("labels.firstRunScreen.usage");
    },
  },
  RecordScreen: {
    get Colors(): string {
      return i18n.t("labels.recordScreen.colors");
    },
    get BloomDepth(): string {
      return i18n.t("labels.recordScreen.bloomDepth");
    },
    get ExposedIce(): string {
      return i18n.t("labels.recordScreen.exposedIce");
    },
    get Gps(): string {
      return i18n.t("labels.recordScreen.gps");
    },
    get ImpuritiesSelectAllThatApply(): string {
      return i18n.t("labels.recordScreen.impuritiesSelectAllThatApply");
    },
    get LocationDescription(): string {
      return i18n.t("labels.recordScreen.locationDescription");
    },
    get Notes(): string {
      return i18n.t("labels.recordScreen.notes");
    },
    get Photos(): string {
      return i18n.t("labels.recordScreen.photos");
    },
    get RecordType(): string {
      return i18n.t("labels.recordScreen.recordType");
    },
    get OnGlacier(): string {
      return i18n.t("labels.recordScreen.onGlacier");
    },
    get UnderSnowpack(): string {
      return i18n.t("labels.recordScreen.underSnowpack");
    },
    get Size(): string {
      return i18n.t("labels.recordScreen.size");
    },
    get SnowpackThickness(): string {
      return i18n.t("labels.recordScreen.snowpackThickness");
    },
    get Other(): string {
      return i18n.t("labels.recordScreen.other");
    },
  },
  RecordDetailsScreen: {
    get BloomDepth(): string {
      return i18n.t("labels.recordDetailsScreen.bloomDepth");
    },
    get Colors(): string {
      return i18n.t("labels.recordDetailsScreen.colors");
    },
    get DataSheet(): string {
      return i18n.t("labels.recordDetailsScreen.dataSheet");
    },
    get Gps(): string {
      return i18n.t("labels.recordDetailsScreen.gps");
    },
    get Impurities(): string {
      return i18n.t("labels.recordDetailsScreen.impurities");
    },
    get Latitude(): string {
      return i18n.t("labels.recordDetailsScreen.latitude");
    },
    get LocationDescription(): string {
      return i18n.t("labels.recordDetailsScreen.locationDescription");
    },
    get Longitude(): string {
      return i18n.t("labels.recordDetailsScreen.longitude");
    },
    get Notes(): string {
      return i18n.t("labels.recordDetailsScreen.notes");
    },
    get SeeExposedIce(): string {
      return i18n.t("labels.recordDetailsScreen.seeExposedIce");
    },
    get Size(): string {
      return i18n.t("labels.recordDetailsScreen.size");
    },
    get SnowPackDepth(): string {
      return i18n.t("labels.recordDetailsScreen.snowPackDepth");
    },
    get WasOnGlacier(): string {
      return i18n.t("labels.recordDetailsScreen.wasOnGlacier");
    },
    get WhatWasUnderSnowpack(): string {
      return i18n.t("labels.recordDetailsScreen.whatWasUnderSnowpack");
    },
  },
  TimelineScreen: {
    get DownloadedRecords(): string {
      return i18n.t("labels.timelineScreen.downloadedRecords");
    },
    get ExampleRecords(): string {
      return i18n.t("labels.timelineScreen.exampleRecords");
    },
    get PendingRecords(): string {
      return i18n.t("labels.timelineScreen.pendingRecords");
    },
  },
  SettingsScreen: {
    get DarkMode(): string {
      return i18n.t("labels.settingsScreen.darkMode");
    },
    get ManualCoordinates(): string {
      return i18n.t("labels.settingsScreen.manualCoordinates");
    },
  },
  StatusBar: {
    get NoConnection(): string {
      return i18n.t("labels.statusBar.noConnection");
    },
  },
  Modal: {
    get Cancel(): string {
      return i18n.t("labels.modal.cancel");
    },
    get Confirm(): string {
      return i18n.t("labels.modal.confirm");
    },
    DiskUsage: {
      get header(): string {
        return i18n.t("labels.modal.diskUsage.header");
      },
      get body(): string {
        return i18n.t("labels.modal.diskUsage.body");
      },
    },
    GpsManualEntry: {
      get header(): string {
        return i18n.t("labels.modal.gpsManualEntry.header");
      },
      get body(): string {
        return i18n.t("labels.modal.gpsManualEntry.body");
      },
    },
  },
};

export const Notifications = {
  uploadSuccess: {
    get title(): string {
      return i18n.t("notifications.uploadSuccess.title");
    },
    get message(): string {
      return i18n.t("notifications.uploadSuccess.message");
    },
  },
  uploadRecordFailed: {
    get title(): string {
      return i18n.t("notifications.uploadRecordFailed.title");
    },
    get message(): string {
      return i18n.t("notifications.uploadRecordFailed.message");
    },
  },
  uploadPhotoFailed: {
    get title(): string {
      return i18n.t("notifications.uploadPhotoFailed.title");
    },
    get message(): string {
      return i18n.t("notifications.uploadPhotoFailed.message");
    },
  },
  uploadPhotosFailed: {
    get title(): string {
      return i18n.t("notifications.uploadPhotosFailed.title");
    },
    get message(): string {
      return i18n.t("notifications.uploadPhotosFailed.message");
    },
  },
  updateRecordSuccess: {
    get title(): string {
      return i18n.t("notifications.updateRecordSuccess.title");
    },
  },
  updateRecordFailed: {
    get title(): string {
      return i18n.t("notifications.updateRecordFailed.title");
    },
    get message(): string {
      return i18n.t("notifications.updateRecordFailed.message");
    },
  },
  backgroundTasksNotAllowed: {
    get title(): string {
      return i18n.t("notifications.backgroundTasksNotAllowed.title");
    },
    get message(): string {
      return i18n.t("notifications.backgroundTasksNotAllowed.message");
    },
  },
};

export const Validations = {
  get invalidCoordinates(): string {
    return i18n.t("validations.invalidCoordinates");
  },
  get invalidAlgaeSize(): string {
    return i18n.t("validations.invalidAlgaeSize");
  },
  get invalidAlgaeColors(): string {
    return i18n.t("validations.invalidAlgaeColors");
  },
};

export const Errors = {
  get recordNotFound(): string {
    return i18n.t("errors.recordNotFound");
  },
};

export const RecordDescription = {
  get Sample(): string {
    return i18n.t("recordDescription.sample");
  },
  get Sighting(): string {
    return i18n.t("recordDescription.sighting");
  },
  get Undefined(): string {
    return i18n.t("recordDescription.undefined");
  },
};

export const AlgaeSizeDescription = {
  get Select(): string {
    return i18n.t(["algaeSizeDescription", "Select a size"]);
  },
  get Fist(): string {
    return i18n.t("algaeSizeDescription.Fist");
  },
  get DinnerPlate(): string {
    return i18n.t(["algaeSizeDescription", "Dinner Plate"]);
  },
  get Bicycle(): string {
    return i18n.t("algaeSizeDescription.Bicycle");
  },
  get Car(): string {
    return i18n.t("algaeSizeDescription.Car");
  },
  get Bus(): string {
    return i18n.t("algaeSizeDescription.Bus");
  },
  get House(): string {
    return i18n.t("algaeSizeDescription.House");
  },
  get SportsField(): string {
    return i18n.t(["algaeSizeDescription", "Sports Field"]);
  },
  get Other(): string {
    return i18n.t("algaeSizeDescription.Other");
  },
};

export const AlgaeColorDescription = {
  get Select(): string {
    return i18n.t("algaeColorDescription.select");
  },
  get Red(): string {
    return i18n.t("algaeColorDescription.red");
  },
  get Pink(): string {
    return i18n.t("algaeColorDescription.pink");
  },
  get Grey(): string {
    return i18n.t("algaeColorDescription.grey");
  },
  get Green(): string {
    return i18n.t("algaeColorDescription.green");
  },
  get Orange(): string {
    return i18n.t("algaeColorDescription.orange");
  },
  get Yellow(): string {
    return i18n.t("algaeColorDescription.yellow");
  },
  get Other(): string {
    return i18n.t("algaeColorDescription.other");
  },
};

export const BloomDepthDescription = {
  get Select(): string {
    return i18n.t("bloomDepthDescription.select");
  },
  get Surface(): string {
    return i18n.t("bloomDepthDescription.surface");
  },
  get TwoCm(): string {
    return i18n.t("bloomDepthDescription.twoCm");
  },
  get FiveCm(): string {
    return i18n.t("bloomDepthDescription.fiveCm");
  },
  get TenCm(): string {
    return i18n.t("bloomDepthDescription.tenCm");
  },
  get GreaterThan10Cm(): string {
    return i18n.t("bloomDepthDescription.greaterThan10Cm");
  },
  get Other(): string {
    return i18n.t("bloomDepthDescription.other");
  },
};

export const ExposedIceDescription = {
  get Yes(): string {
    return i18n.t("exposedIceDescription.yes");
  },
  get No(): string {
    return i18n.t("exposedIceDescription.no");
  },
};

export const ImpuritiesDescription = {
  get OrangeDust(): string {
    return i18n.t("impuritiesDescription.orangeDust");
  },
  get Soot(): string {
    return i18n.t("impuritiesDescription.soot");
  },
  get Soil(): string {
    return i18n.t("impuritiesDescription.soil");
  },
  get Vegetation(): string {
    return i18n.t("impuritiesDescription.vegetation");
  },
  get Pollen(): string {
    return i18n.t("impuritiesDescription.pollen");
  },
  get EvidenceOfAnimals(): string {
    return i18n.t("impuritiesDescription.evidenceOfAnimals");
  },
  get Other(): string {
    return i18n.t("impuritiesDescription.other");
  },
};

export const OnOffGlacierDescription = {
  get Yes(): string {
    return i18n.t("onOffGlacierDescription.yes");
  },
  get No(): string {
    return i18n.t("onOffGlacierDescription.no");
  },
};

export const SnowpackThicknessDescription = {
  get Select(): string {
    return i18n.t("snowpackThicknessDescription.select");
  },
  get LessThan10Cm(): string {
    return i18n.t("snowpackThicknessDescription.lessThan10Cm");
  },
  get Between10Cm30Cm(): string {
    return i18n.t("snowpackThicknessDescription.between10Cm30Cm");
  },
  get ThirtyCm1M(): string {
    return i18n.t("snowpackThicknessDescription.thirtyCm1M");
  },
  get GreaterThan1M(): string {
    return i18n.t("snowpackThicknessDescription.greaterThan1M");
  },
  get Other(): string {
    return i18n.t("snowpackThicknessDescription.other");
  },
};

export const UnderSnowpackDescription = {
  get Select(): string {
    return i18n.t("underSnowpackDescription.select");
  },
  get Vegetation(): string {
    return i18n.t("underSnowpackDescription.vegetation");
  },
  get Rocks(): string {
    return i18n.t("underSnowpackDescription.rocks");
  },
  get Soil(): string {
    return i18n.t("underSnowpackDescription.soil");
  },
  get PondOrTarn(): string {
    return i18n.t("underSnowpackDescription.pondOrTarn");
  },
  get Lake(): string {
    return i18n.t("underSnowpackDescription.lake");
  },
  get Stream(): string {
    return i18n.t("underSnowpackDescription.stream");
  },
  get Mixed(): string {
    return i18n.t("underSnowpackDescription.mixed");
  },
  get IdontKnow(): string {
    return i18n.t("underSnowpackDescription.iDontKnow");
  },
};

export const BackgroundTasks = {
  get UploadData(): string {
    return i18n.t("backgroundTasks.uploadData");
  },
};

export const Headers = {
  get DiskUsage(): string {
    return i18n.t("headers.diskUsage");
  },
  get Profile(): string {
    return i18n.t("headers.profile");
  },
  get Prompts(): string {
    return i18n.t("headers.prompts");
  },
  get Theme(): string {
    return i18n.t("headers.theme");
  },
};
