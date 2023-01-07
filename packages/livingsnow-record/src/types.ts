// Represents a photo the service is tracking.
export type Photo = {
  uri: string; // name of the photo file in Blob Storage Container
  width: number;
  height: number;
  size: number;
};

// Represents a photo saved to disk when its record was uploaded but the photo was not.
// This scenario can happen when a user has intermittent cel signal in the wilderness.
// TODO: export type PendingPhoto = Omit<Photo, "size"> & {
export type PendingPhoto = Photo & {
  id: number; // id of the uploaded record photo associated with
};

// Represents a photo that has been selected from expo-images-picker but it and parent
// record have not been uploaded yet (offline scenario).
export type SelectedPhoto = Omit<Photo, "size"> & {
  id: string; // id returned from expo-images-picker
};

const AlgaeSizeArray = [
  "Select a size",
  "Fist",
  "Shoe Box",
  "Coffee Table",
  "Car",
  "Bus",
  "Playground",
  "Sports Field",
  "Other",
] as const;

export type AlgaeSize = typeof AlgaeSizeArray[number];

const AlgaeColorArray = [
  "Select a color",
  "Red",
  "Pink",
  "Grey",
  "Green",
  "Orange",
  "Yellow",
  "Other",
] as const;

export type AlgaeColor = typeof AlgaeColorArray[number];

const AlgaeRecordTypeArray = ["Sample", "Sighting", "Undefined"] as const;

export type AlgaeRecordType = typeof AlgaeRecordTypeArray[number];

export type AlgaeRecord = {
  id: number;
  type: AlgaeRecordType;
  name?: string;
  organization?: string;
  date: Date;
  latitude: number;
  longitude: number;
  size: AlgaeSize;
  color: AlgaeColor[];
  tubeId?: string;
  locationDescription?: string;
  notes?: string;
  photos?: Photo[]; // TODO: | SelectedPhoto[]; Photo[] on download, SelectedPhoto[] before upload, PendingPhoto[] on upload
};
