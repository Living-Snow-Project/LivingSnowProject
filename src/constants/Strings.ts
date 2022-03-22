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
    LocationDescription: "Location Description",
    Notes: "Notes",
    AtlasSnowSurface: "Atlas Snow Surface",
    Photos: "Photos",
  },
  TimelineScreen: {
    ExampleRecords: "Example Record",
    PendingRecords: "Pending",
    DownloadedRecords: "Downloaded",
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
};

const Errors = {
  recordNotFound: "Record to update not found",
};

const RecordDescription = {
  Sample: `I'm Taking a Sample`,
  Sighting: `I'm Reporting a Sighting`,
  AtlasRedDot: `Atlas: Red Dot`,
  AtlasRedDotWithSample: `Atlas: Red Dot with Sample`,
  AtlasBlueDot: `Atlas: Blue Dot`,
  AtlasBlueDotWithSample: `Atlas: Blue Dot with Sample`,
  Undefined: "Undefined",
};

const AtlasDescription = {
  SnowAlgae: "Snow Algae",
  DirtOrDebris: "Dirt or Debris",
  Ash: "Ash",
  WhiteSnow: "White Snow",
  MixOfAlgaeAndDirt: `Mix of Algae and Dirt`,
  ForestOrVegetation: `Forest or Vegetation`,
  Other: `Other (please describe in notes)`,
  Undefined: "Undefined",
};

export {
  Errors,
  Notifications,
  Placeholders,
  Labels,
  RecordDescription,
  AtlasDescription,
};
