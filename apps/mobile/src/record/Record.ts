import { AlgaeRecordType } from "@livingsnow/record";
import { Asset } from "expo-media-library";
import { RecordDescription } from "../constants/Strings";
import { LocalAlgaeRecord } from "../../types";

type RecordTypeSelectorItem = {
  value: AlgaeRecordType;
  label: string;
};

const recordTypeSelectorItems: RecordTypeSelectorItem[] = [
  { value: "Sighting", label: RecordDescription.Sighting },
  { value: "Sample", label: RecordDescription.Sample },
];

const getAllRecordTypeSelectorItems = (): RecordTypeSelectorItem[] =>
  recordTypeSelectorItems;

/* eslint-disable @typescript-eslint/no-var-requires */
const examplePhoto = require("../../assets/images/splash.png");

const productionExampleRecord = (): LocalAlgaeRecord => ({
  record: {
    id: "1234",
    type: "Sample",
    name: "Helpful Individual",
    organization: "Community Scientist",
    date: new Date("2022-04-01T00:00:00"),
    latitude: 48.06727,
    longitude: -121.12165,
    size: "Fist",
    colors: ["Red", "Pink"],
    tubeId: "TUBE-1234",
    locationDescription: "White Chuck Glacier, Glacier Peak Wilderness, WA",
    notes: "Dark red algae in runnels",
  },
  photos: [{ uri: examplePhoto, width: 128, height: 128 } as unknown as Asset],
});

export { getAllRecordTypeSelectorItems, productionExampleRecord };
