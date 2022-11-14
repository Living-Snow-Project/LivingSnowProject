// what a photo looks like from service perspective
export type Photo = {
  uri: string; // name of the photo file in Blob Storage Container
  width: number;
  height: number;
  size: number;
};

// photo saved to disk when its record was uploaded
export type PendingPhoto = Photo & {
  id: number; // id of the uploaded record photo associated with
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
  color: AlgaeColor;
  tubeId?: string;
  locationDescription?: string;
  notes?: string;
  photos?: Photo[];
};
