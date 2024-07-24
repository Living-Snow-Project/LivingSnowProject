import { getAllRecordTypeSelectorItems } from "../Record";
import { RecordDescription } from "../../constants/Strings";

const getRecordTypeSelectorItem = (type) => {
  const result = getAllRecordTypeSelectorItems().find(
    (cur) => cur.value == type,
  );

  if (result == undefined) {
    return { value: "Undefined", label: RecordDescription.Undefined };
  }

  return result;
};

describe("Record test suite", () => {
  test("getRecordTypeSelectorItem values", () => {
    let cur = getRecordTypeSelectorItem("Sample");
    expect(cur.label).toEqual(RecordDescription.Sample);

    cur = getRecordTypeSelectorItem("Sighting");
    expect(cur.label).toEqual(RecordDescription.Sighting);
  });

  test("getRecordTypeSelectorItem undefined record type", () => {
    expect(getRecordTypeSelectorItem("Undefined").label).toEqual(
      RecordDescription.Undefined,
    );
  });
});
