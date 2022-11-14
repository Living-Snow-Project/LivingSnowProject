import { AlgaeRecord, AlgaeRecordType } from "@livingsnow/record";
import { RecordDescription } from "../constants/Strings";

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

export {
  getRecordTypePickerItem,
  getAllRecordTypePickerItems,
  productionExampleRecord,
};
