// global types

type AppSettings = {
  name: string | undefined;
  organization: string | undefined;
  showFirstRun: boolean;
  showGpsWarning: boolean;
  showAtlasRecords: boolean;
  showOnlyAtlasRecords: boolean;
};

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
  photoUris?: string;
  atlasType?: AtlasType;
};

// TODO: this will need to change to something like "ServicePhoto" {recordId: number, photo: NativePhoto}
type Photo = {
  id: number;
  photoStream: string;
};

type NativePhoto = {
  uri: string;
  width: number;
  height: number;
};
