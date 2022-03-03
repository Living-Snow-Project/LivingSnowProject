import { RecordDescription } from "../constants/Strings";

type RecordTypePickerItem = {
  value: AlgaeRecordType;
  label: string;
};

// specific format for RNPickerSelect
const recordTypePickerItems: RecordTypePickerItem[] = [
  { value: "Sample", label: RecordDescription.Sample },
  { value: "Sighting", label: RecordDescription.Sighting },
  { value: "Atlas: Red Dot", label: RecordDescription.AtlasRedDot },
  {
    value: "Atlas: Red Dot with Sample",
    label: RecordDescription.AtlasRedDotWithSample,
  },
  { value: "Atlas: Blue Dot", label: RecordDescription.AtlasBlueDot },
  {
    value: "Atlas: Blue Dot with Sample",
    label: RecordDescription.AtlasBlueDotWithSample,
  },
];

const getAllRecordTypePickerItems = (): RecordTypePickerItem[] =>
  recordTypePickerItems;

const getRecordTypePickerItem = (
  type: AlgaeRecordType
): RecordTypePickerItem => {
  const result = recordTypePickerItems.find((cur) => cur.value === type);

  if (result === undefined) {
    return { value: "Undefined", label: RecordDescription.Undefined };
  }

  return result;
};

const isSample = (type: AlgaeRecordType): boolean =>
  Array<AlgaeRecordType>(
    "Sample",
    "Atlas: Red Dot with Sample",
    "Atlas: Blue Dot with Sample"
  ).includes(type);

const isAtlas = (type: AlgaeRecordType): boolean =>
  Array<AlgaeRecordType>(
    "Atlas: Red Dot",
    "Atlas: Red Dot with Sample",
    "Atlas: Blue Dot",
    "Atlas: Blue Dot with Sample"
  ).includes(type);

// TODO: makeExampleRecord should also be used to seed RecordScreen (ie. no more "no records to display")
const makeExampleRecord = (type: AlgaeRecordType): AlgaeRecord => {
  const atlasType: AtlasType = isAtlas(type) ? "Snow Algae" : "Undefined";

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
    photos: [
      {
        uri: "46",
        size: 100,
        width: 16,
        height: 16,
      },
      { uri: "23", size: 4096, width: 128, height: 128 },
    ],
  };
};

// needed for JSON.parse, otherwise date property will become string
const recordReviver = (key: string, value: any): any => {
  if (key === "date") {
    return new Date(value);
  }

  return value;
};

// decodes AlgaeRecord or AlgaeRecord[] JSON
function jsonToRecord<T>(json: string): T {
  return JSON.parse(json, recordReviver);
}

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
  getRecordTypePickerItem,
  getAllRecordTypePickerItems,
  makeExampleRecord,
  isSample,
  isAtlas,
  jsonToRecord,
  recordDateFormat,
};
