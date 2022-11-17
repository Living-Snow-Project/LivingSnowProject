import { getRecordTypePickerItem } from "../Record";
import { RecordDescription } from "../../constants/Strings";

describe("Record test suite", () => {
  test("getRecordTypePickerItem values", () => {
    let cur = getRecordTypePickerItem("Sample");
    expect(cur.label).toEqual(RecordDescription.Sample);

    cur = getRecordTypePickerItem("Sighting");
    expect(cur.label).toEqual(RecordDescription.Sighting);
  });

  test("getRecordTypePickerItem undefined record type", () => {
    expect(getRecordTypePickerItem("Undefined").label).toEqual(
      RecordDescription.Undefined
    );
  });
});
