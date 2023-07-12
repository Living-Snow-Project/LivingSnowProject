// App photos have various representation but these fields are common across them
export type AppPhoto = {
  uri: string;
  width: number;
  height: number;
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
  "Select colors",
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
  id: string;
  colors: AlgaeColor[];
  date: Date;
  latitude: number;
  longitude: number;
  size: AlgaeSize;
  type: AlgaeRecordType;

  locationDescription?: string;
  name?: string;
  notes?: string;
  organization?: string;
  tubeId?: string;
};
