const Placeholders = {
  GPS: {
    AcquiringLocation: "Looking for GPS signal",
    EnterCoordinates: "ie. 12.345678, -123.456789",
    NoPermissions:
      "Check location permissions in Settings. Enter coordinates manually.",
    NoLocation: "Could not determine location. Enter coordinates manually.",
  },
};

const Notifications = {
  uploadSuccess: {
    title: "Upload succeeded",
    message: "Thanks for your submission.",
  },
  uploadFailed: {
    title: "Record Saved",
    message: "We will upload it later.",
  },
  invalidCoordinates: {
    title: "Invalid GPS coordinates",
    message:
      'Coordinates must be in "lat, long" format. ie. 12.345678, -123.456789',
  },
};

export { Notifications, Placeholders };