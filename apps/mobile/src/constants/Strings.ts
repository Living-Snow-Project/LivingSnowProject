// for TextInput placeholder prop
const Placeholders = {
  GPS: {
    AcquiringLocation: "Looking for GPS signal",
    EnterCoordinates: "ie. 12.345678, -123.456789",
    NoPermissions:
      "Check location permissions in Settings. Enter coordinates manually.",
    NoLocation: "Could not determine location. Enter coordinates manually.",
  },
  Settings: {
    Username: "Enter your name",
    Organization: "Enter organization you belong to (if any)",
  },
  RecordScreen: {
    TubeId: "Leave blank if tube does not have an id",
    LocationDescription: "ie: Blue Lake, North Cascades, WA",
    Notes: "ie. dark red algae on glacial ice",
  },
};

const Labels = {
  RecordFields: {
    Type: "Type",
    Name: "Name",
    Organization: "Organization",
    Date: "Date",
    TubeId: "Tube Id",
    GPSCoordinates: "Coordinates",
    Latitude: "Latitude",
    Longitude: "Longitude",
    Size: "Size",
    Color: "Color",
    LocationDescription: "Location Description",
    Notes: "Notes",
    Photos: "Photos",
  },
  TimelineScreen: {
    ExampleRecords: "Example Record",
    PendingRecords: "Pending",
    DownloadedRecords: "Downloaded",
  },
  SettingsScreen: {
    DarkMode: "Dark",
    ManualCoordinates: "Manual Coordinates Warning",
  },
  StatusBar: {
    NoConnection: "No Internet Connection",
  },
};

// for Alert.alert calls
const Notifications = {
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
  invalidCoordinates: {
    title: "Invalid GPS coordinates",
    message:
      'Coordinates must be in "lat, long" format. ie. 12.345678, -123.456789',
  },
  invalidAlgaeSize: {
    title: "A size must be specified",
  },
  invalidAlgaeColor: {
    title: "A color must be specified",
  },
  backgroundTasksNotAllowed: {
    title: "Background Uploads Not Enabled",
    message:
      "Please enable Background App Refresh if you would like stored records to be uploaded in the background.",
  },
};

const Errors = {
  recordNotFound: "Record to update not found",
};

const RecordDescription = {
  Sample: `I'm Taking a Sample`,
  Sighting: `I'm Reporting a Sighting`,
  Undefined: "Undefined",
};

const AlgaeSizeDescription = {
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

const AlgaeColorDescription = {
  Select: "Select a color",
  Red: "Red",
  Pink: "Pink",
  Grey: "Grey",
  Green: "Green",
  Orange: "Orange",
  Yellow: "Yellow",
  Other: "Other (describe in notes)",
};

const BackgroundTasks = {
  UploadData: "background-upload-task",
};

const Headers = {
  DiskUsage: "Disk Usage",
  Profile: "Profile",
  Prompts: "Prompts",
  Theme: "Theme",
};

export {
  Errors,
  Notifications,
  Placeholders,
  Headers,
  Labels,
  RecordDescription,
  AlgaeSizeDescription,
  AlgaeColorDescription,
  BackgroundTasks,
};
