import { AlgaeRecord, AlgaeRecordType } from "@livingsnow/record";
import { RecordDescription } from "../constants/Strings";
import { makeExamplePhoto } from "./Photo";

// TODO: break up; test helpers and @livingsnow/record
// specific format for RNPickerSelect
type RecordTypePickerItem = {
  value: AlgaeRecordType;
  label: string;
};

const recordTypePickerItems: RecordTypePickerItem[] = [
  { value: "Sample", label: RecordDescription.Sample },
  { value: "Sighting", label: RecordDescription.Sighting },
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
  Array<AlgaeRecordType>("Sample").includes(type);

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
const makeExampleRecord = (type: AlgaeRecordType): AlgaeRecord => ({
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
  photos: [makeExamplePhoto({ uri: "46" }), makeExamplePhoto({ uri: "23" })],
});

export {
  getRecordTypePickerItem,
  getAllRecordTypePickerItems,
  makeExampleRecord,
  productionExampleRecord,
  isSample,
};
