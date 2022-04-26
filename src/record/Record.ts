import { RecordDescription } from "../constants/Strings";
import { makeExamplePhoto } from "./Photo";

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

const examplePhoto = require("../../assets/images/splash.png");

const productionExampleRecord = (): AlgaeRecord => ({
  id: 1234,
  type: "Sample",
  name: "Helpful Individual",
  organization: "Community Scientist",
  date: new Date("2022-04-01T00:00:00"),
  latitude: 48.06727,
  longitude: -121.12165,
  size: "Fist",
  color: "Red",
  tubeId: "TUBE-1234",
  locationDescription: "White Chuck Glacier, Glacier Peak Wilderness, WA",
  notes: "Dark red algae in runnels",
  photos: [
    {
      uri: examplePhoto,
      size: 100,
      width: 128,
      height: 128,
    },
  ],
});

// consider randomizing more data; how that impacts snapshot testing and the above desired feature
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
    size: "Fist",
    color: "Red",
    tubeId: isSample(type) ? "LAB-1337" : "",
    locationDescription: "test location",
    notes: "test notes",
    atlasType,
    photos: [makeExamplePhoto({ uri: "46" }), makeExamplePhoto({ uri: "23" })],
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
  productionExampleRecord,
  isSample,
  isAtlas,
  jsonToRecord,
  recordDateFormat,
};
