import {
  getRecordTypePickerItem,
  isSample,
  isAtlas,
  recordDateFormat,
} from "../Record";
import { RecordDescription } from "../../constants/Strings";

describe("Record test suite", () => {
  test("getRecordTypePickerItem values", () => {
    let cur = getRecordTypePickerItem("Sample");
    expect(cur.label).toEqual(RecordDescription.Sample);

    cur = getRecordTypePickerItem("Sighting");
    expect(cur.label).toEqual(RecordDescription.Sighting);

    cur = getRecordTypePickerItem("Atlas: Red Dot");
    expect(cur.label).toEqual(RecordDescription.AtlasRedDot);

    cur = getRecordTypePickerItem("Atlas: Red Dot with Sample");
    expect(cur.label).toEqual(RecordDescription.AtlasRedDotWithSample);

    cur = getRecordTypePickerItem("Atlas: Blue Dot");
    expect(cur.label).toEqual(RecordDescription.AtlasBlueDot);

    cur = getRecordTypePickerItem("Atlas: Blue Dot with Sample");
    expect(cur.label).toEqual(RecordDescription.AtlasBlueDotWithSample);
  });

  test("getRecordTypePickerItem undefined record type", () => {
    expect(getRecordTypePickerItem("Undefined").label).toEqual(
      RecordDescription.Undefined
    );
  });

  test("isSample combinations", () => {
    expect(isSample("Sample")).toEqual(true);
    expect(isSample("Atlas: Red Dot with Sample")).toEqual(true);
    expect(isSample("Atlas: Blue Dot with Sample")).toEqual(true);
    expect(isSample("Sighting")).toEqual(false);
    expect(isSample("Atlas: Red Dot")).toEqual(false);
    expect(isSample("Atlas: Blue Dot")).toEqual(false);
  });

  test("isAtlas combinations", () => {
    expect(isAtlas("Sample")).toEqual(false);
    expect(isAtlas("Sighting")).toEqual(false);
    expect(isAtlas("Atlas: Red Dot")).toEqual(true);
    expect(isAtlas("Atlas: Red Dot with Sample")).toEqual(true);
    expect(isAtlas("Atlas: Blue Dot")).toEqual(true);
    expect(isAtlas("Atlas: Blue Dot with Sample")).toEqual(true);
  });

  test("recordDateFormat small month and day", () => {
    expect(recordDateFormat(new Date("2022-01-02T00:00:00"))).toEqual(
      "2022-01-02"
    );
  });

  test("recordDateFormat big month and day", () => {
    expect(recordDateFormat(new Date("2022-12-13T00:00:00"))).toEqual(
      "2022-12-13"
    );
  });
});
