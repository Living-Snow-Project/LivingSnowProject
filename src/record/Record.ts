import { AtlasType } from "./Atlas";
import { RecordDescription } from "../constants/Strings";

// TODO: make this type RecordType = "Sample" | "Sighting" | "etc..."
// because data going in to and out of the service API should not be magic numbers!
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

const getAllRecordTypePickerItems = (): RecordTypePickerItem[] =>
  RecordTypePickerItems;

const getRecordTypePickerItem = (type: RecordType): RecordTypePickerItem =>
  type > RecordType.Undefined && type < RecordType.Max
    ? RecordTypePickerItems[type]
    : { value: RecordType.Undefined, label: RecordDescription.Undefined };

type Record = {
  id: number;
  type: RecordType;
  name?: string;
  organization?: string;
  date: Date;
  latitude: number;
  longitude: number;
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
    id: 1234,
    type,
    name: "test name",
    date: new Date("2021-09-16T00:00:00"),
    organization: "test org",
    latitude: -123.456,
    longitude: 96.96,
    tubeId: isSample(type) ? "LAB-1337" : "",
    locationDescription: "test location",
    notes: "test notes",
    atlasType,
    photoUris: "46;23;",
  };
};

// needed for JSON.parse, otherwise date property will become string
// TODO: add test for photoUris key
const recordReviver = (key: string, value: any): any => {
  if (key === "date") {
    return new Date(value);
  }

  return value;
};

const jsonToRecord = (json: string): Record | Record[] =>
  JSON.parse(json, recordReviver);

// want to display date in YYYY-MM-DD format
const recordDateFormat = (date: Date): string => {
  const dayNum: number = date.getDate();
  let day: string = `${dayNum}`;

  if (dayNum < 10) {
    day = `0${dayNum}`;
  }

  const monthNum: number = date.getMonth() + 1;
  let month: string = `${monthNum}`;

  if (monthNum < 10) {
    month = `0${monthNum}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
};

export {
  RecordType,
  Record,
  getRecordTypePickerItem,
  getAllRecordTypePickerItems,
  makeExampleRecord,
  isSample,
  isAtlas,
  jsonToRecord,
  recordDateFormat,
};
