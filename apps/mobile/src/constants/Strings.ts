// for TextInput placeholder prop
export const Placeholders = {
  GPS: {
    AcquiringLocation: "Looking for GPS signal",
    EnterCoordinates: "ie. 12.34567, -123.45678",
    NoPermissions:
      "Check location permissions in Settings. Enter coordinates manually.",
    NoLocation: "Could not determine location. Enter coordinates manually.",
  },
  Settings: {
    Username: "Enter your name",
    Organization: "Enter organization you belong to (if any)",
  },
  RecordScreen: {
    LocationDescription: "ie: Blue Lake, North Cascades, WA",
    Notes: "ie. dark red algae on glacial ice",
    Size: "Select a size",
    TubeId: "Leave blank if tube does not have an id",
    TubeIdDisabled: "Disabled - only used for Samples",
  },
};

const locationDescription = "Location Description";
const notes = "Notes";

export const Labels = {
  Date: "Date",
  DefaultName: "Community Scientist",
  Delete: "Delete",
  LivingSnowProject: "Living Snow Project",
  Name: "Name",
  Organization: "Organization",
  Photos: "Photos",
  RecordType: "Type",
  Slogan: "See pink snow? Let us know!",
  TubeId: "Tube Id",
  FirstRunScreen: {
    StartReporting: "Start Reporting",
    Usage:
      "Let us know who you are or remain anonymous. You can update your profile at any time in the Settings tab.",
  },
  RecordScreen: {
    Colors: "Colors (select all that apply)",
    Gps: "GPS Coordinates (latitude, longitude)",
    LocationDescription: `${locationDescription} (limit 255 characters)`,
    Notes: `${notes} (limit 255 characters)`,
    Photos: "Select Photos (limit 4)",
    RecordType: "Are you Reporting a Sighting or Taking a Sample?",
    Size: "Select a size",
  },
  RecordDetailsScreen: {
    Colors: "Colors",
    DataSheet: "Data Sheet",
    Gps: "Coordinates",
    Latitude: "Latitude",
    LocationDescription: `${locationDescription}`,
    Longitude: "Longitude",
    Notes: `${notes}`,
    Size: "Size",
  },
  TimelineScreen: {
    DownloadedRecords: "Downloaded",
    ExampleRecords: "Example Record",
    PendingRecords: "Pending",
  },
  SettingsScreen: {
    DarkMode: "Dark",
    ManualCoordinates: "Manual Coordinates Warning",
  },
  StatusBar: {
    NoConnection: "No Internet Connection",
  },
  Modal: {
    Cancel: "Cancel",
    Confirm: "Confirm",
    DiskUsage: {
      body: "Are you sure you want to delete saved photos?",
      header: "Confirm Delete",
    },
    GpsManualEntry: {
      body: `Some users enter coordinates manually if they cannot acquire GPS signal or when they return home.\n\nThis message can be disabled in Settings.`,
      header: "Enter coordinates manually?",
    },
  },
};

// for Modal alerts
export const Notifications = {
  uploadSuccess: {
    title: "Record Uploaded",
    message: "Thanks for your submission.",
  },
  uploadRecordFailed: {
    title: "Record Saved",
    message: "We will upload it later.",
  },
  uploadPhotoFailed: {
    title: "Photo Saved",
    message: "We will upload it later.",
  },
  uploadPhotosFailed: {
    title: "Photos Saved",
    message: "We will upload them later.",
  },
  updateRecordSuccess: {
    title: "Record Updated",
  },
  updateRecordFailed: {
    title: "Update Failed",
    message:
      "This can happen when Internet connectivity is restored while updating the record.",
  },
  backgroundTasksNotAllowed: {
    title: "Background Uploads Not Enabled",
    message:
      "Please enable Background App Refresh if you would like stored records to be uploaded in the background.",
  },
};

export const Validations = {
  invalidCoordinates:
    'Coordinates must be in "lat, long" format. eg. 12.34567, -123.45678',
  invalidAlgaeSize: "A size must be specified",
  invalidAlgaeColors: "At least 1 color must be specified",
};

export const Errors = {
  recordNotFound: "Record to update not found",
};

export const RecordDescription = {
  Sample: `Sample`,
  Sighting: `Sighting`,
  Undefined: "Undefined",
};

export const AlgaeSizeDescription = {
  Select: "Select a size",
  Fist: "Fist",
  ShoeBox: "Shoe Box",
  CoffeeTable: "Coffee Table",
  Car: "Car",
  Bus: "Bus",
  Playground: "Playground",
  SportsField: "Sports Field",
  Other: "Other (describe in notes)",
};

export const AlgaeColorDescription = {
  Select: "Select a color",
  Red: "Red",
  Pink: "Pink",
  Grey: "Grey",
  Green: "Green",
  Orange: "Orange",
  Yellow: "Yellow",
  Other: "Other (describe in notes)",
};

export const BackgroundTasks = {
  UploadData: "background-upload-task",
};

// TODO: move this to Labels
export const Headers = {
  DiskUsage: "Disk Usage",
  Profile: "Profile",
  Prompts: "Prompts",
  Theme: "Theme",
};
