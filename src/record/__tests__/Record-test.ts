import { getRecordTypePickerItem, isSample, recordDateFormat } from "../Record";
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

  test("isSample combinations", () => {
    expect(isSample("Sample")).toEqual(true);
    expect(isSample("Sighting")).toEqual(false);
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
