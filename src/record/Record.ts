import { AtlasType } from "./Atlas";
import { RecordDescription } from "../constants/Strings";

enum RecordType {
  Undefined = -1,
  Sample,
  Sighting,
  AtlasRedDot,
  AtlasRedDotWithSample,
  AtlasBlueDot,
  AtlasBlueDotWithSample,
  Max,
}

type RecordTypePickerItem = {
  value: RecordType;
  label: string;
};

// specific format for RNPickerSelect
const RecordTypePickerItems: RecordTypePickerItem[] = [
  { value: RecordType.Sample, label: RecordDescription.Sample },
  { value: RecordType.Sighting, label: RecordDescription.Sighting },
  { value: RecordType.AtlasRedDot, label: RecordDescription.AtlasRedDot },
  {
    value: RecordType.AtlasRedDotWithSample,
    label: RecordDescription.AtlasRedDotWithSample,
  },
  { value: RecordType.AtlasBlueDot, label: RecordDescription.AtlasBlueDot },
  {
    value: RecordType.AtlasBlueDotWithSample,
    label: RecordDescription.AtlasBlueDotWithSample,
  },
];

// TODO: remove this, update database, and break old clients :)
const LegacyRecordTypeValues: string[] = [
  "Sample",
  "Sighting",
  "AtlasRedDot",
  "AtlasRedDotWithSample",
  "AtlasBlueDot",
  "AtlasBlueDotWithSample",
];

const translateToLegacyRecordType = (type: RecordType): string =>
  LegacyRecordTypeValues[type];

const getAllRecordTypePickerItems = (): RecordTypePickerItem[] =>
  RecordTypePickerItems;

const getRecordTypePickerItem = (type: RecordType): RecordTypePickerItem =>
  type > RecordType.Undefined && type < RecordType.Max
    ? RecordTypePickerItems[type]
    : { value: RecordType.Undefined, label: RecordDescription.Undefined };

type Record = {
  id: string;
  type: RecordType;
  name?: string;
  organization?: string;
  date: Date;
  latitude: number | undefined;
  longitude: number | undefined;
  tubeId?: string;
  locationDescription?: string;
  notes?: string;
  photoUris?: string;
  atlasType: AtlasType;
};

// BUGBUG: because legacy record type = string, but we will change to enum and break old clients :)
// So, Downloaded records => record.type = string, Pending\Saved records => record.type = RecordType
const isSample = (type: RecordType): boolean =>
  [
    RecordType.Sample,
    RecordType.AtlasRedDotWithSample,
    RecordType.AtlasBlueDotWithSample,
    "Sample",
    "AtlasRedDotWithSample",
    "AtlasBlueDotWithSample",
  ].includes(type);

// BUGBUG: because legacy record type = string, but we will change to enum and break old clients :)
// So, Downloaded records => record.type = string, Pending\Saved records => record.type = RecordType
const isAtlas = (type: RecordType | string): boolean =>
  [
    RecordType.AtlasRedDot,
    RecordType.AtlasRedDotWithSample,
    RecordType.AtlasBlueDot,
    RecordType.AtlasBlueDotWithSample,
    "AtlasRedDot",
    "AtlasRedDotWithSample",
    "AtlasBlueDot",
    "AtlasBlueDotWithSample",
  ].includes(type);

// TODO: makeExampleRecord should also be used to seed RecordScreen (ie. no more "no records to display")
// BUGBUG: type, atlasType, and photoUris need alignment (new signature below)
// const makeExampleRecords = (type: RecordType): Record => ({
const makeExampleRecord = (type) => {
  const atlasType = isAtlas(type) ? AtlasType.SnowAlgae : AtlasType.Undefined;

  return {
    id: "1234",
    type,
    name: "test name",
    date: "2021-09-16",
    organization: "test org",
    latitude: "-123.456",
    longitude: "96.96",
    tubeId: isSample(type) ? "LAB-1337" : "",
    locationDescription: "test location",
    notes: "test notes",
    atlasType,
    photoUris: "46;23;",
  };
};

export {
  RecordType,
  Record,
  translateToLegacyRecordType,
  getRecordTypePickerItem,
  getAllRecordTypePickerItems,
  makeExampleRecord,
  isSample,
  isAtlas,
};
