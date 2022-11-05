// global types

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
};

// what a photo looks like from service perspective
interface Photo {
  uri: string; // name of the photo file in Blob Storage Container
  width: number;
  height: number;
  size: number;
}

// photo saved to disk when its record was uploaded
interface PendingPhoto extends Photo {
  id: number; // id of the uploaded record photo associated with
}

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

type AlgaeSize = typeof AlgaeSizeArray[number];

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

type AlgaeColor = typeof AlgaeColorArray[number];

const AlgaeRecordTypeArray = ["Sample", "Sighting", "Undefined"] as const;

type AlgaeRecordType = typeof AlgaeRecordTypeArray[number];

type AlgaeRecord = {
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
