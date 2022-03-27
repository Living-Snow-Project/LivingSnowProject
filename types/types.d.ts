// global types

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
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

const AtlasTypeArray = [
  "Snow Algae",
  "Dirt or Debris",
  "Ash",
  "White Snow",
  "Mix of Algae and Dirt",
  "Forest or Vegetation",
  "Other",
  "Undefined",
] as const;

type AtlasType = typeof AtlasTypeArray[number];

const AlgaeRecordTypeArray = [
  "Sample",
  "Sighting",
  "Atlas: Red Dot",
  "Atlas: Red Dot with Sample",
  "Atlas: Blue Dot",
  "Atlas: Blue Dot with Sample",
  "Undefined",
] as const;

type AlgaeRecordType = typeof AlgaeRecordTypeArray[number];

type AlgaeRecord = {
  id: number;
  type: AlgaeRecordType;
  name?: string;
  organization?: string;
  date: Date;
  latitude: number;
  longitude: number;
  tubeId?: string;
  locationDescription?: string;
  notes?: string;
  photos?: Photo[];
  atlasType?: AtlasType;
};
