import {
  RecordType,
  getRecordTypePickerItem,
  isSample,
  isAtlas,
} from "../Record";
import { RecordDescription } from "../../constants/Strings";

describe("Record test suite", () => {
  test("getRecordTypePickerItem values", () => {
    let cur = getRecordTypePickerItem(RecordType.Sample);
    expect(cur.label).toEqual(RecordDescription.Sample);

    cur = getRecordTypePickerItem(RecordType.Sighting);
    expect(cur.label).toEqual(RecordDescription.Sighting);

    cur = getRecordTypePickerItem(RecordType.AtlasRedDot);
    expect(cur.label).toEqual(RecordDescription.AtlasRedDot);

    cur = getRecordTypePickerItem(RecordType.AtlasRedDotWithSample);
    expect(cur.label).toEqual(RecordDescription.AtlasRedDotWithSample);

    cur = getRecordTypePickerItem(RecordType.AtlasBlueDot);
    expect(cur.label).toEqual(RecordDescription.AtlasBlueDot);

    cur = getRecordTypePickerItem(RecordType.AtlasBlueDotWithSample);
    expect(cur.label).toEqual(RecordDescription.AtlasBlueDotWithSample);
  });

  test("getRecordTypePickerItem undefined record type", () => {
    expect(getRecordTypePickerItem(RecordType.Undefined).label).toEqual(
      RecordDescription.Undefined
    );
  });

  test("isSample combinations", () => {
    expect(isSample(RecordType.Sample)).toEqual(true);
    expect(isSample(RecordType.AtlasRedDotWithSample)).toEqual(true);
    expect(isSample(RecordType.AtlasBlueDotWithSample)).toEqual(true);
    expect(isSample(RecordType.Sighting)).toEqual(false);
    expect(isSample(RecordType.AtlasRedDot)).toEqual(false);
    expect(isSample(RecordType.AtlasBlueDot)).toEqual(false);
  });

  test("isAtlas combinations", () => {
    expect(isAtlas(RecordType.Sample)).toEqual(false);
    expect(isAtlas(RecordType.Sighting)).toEqual(false);
    expect(isAtlas(RecordType.AtlasRedDot)).toEqual(true);
    expect(isAtlas(RecordType.AtlasRedDotWithSample)).toEqual(true);
    expect(isAtlas(RecordType.AtlasBlueDot)).toEqual(true);
    expect(isAtlas(RecordType.AtlasBlueDotWithSample)).toEqual(true);
  });
});
