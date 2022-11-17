import { isSample, recordDateFormat } from "../src";

describe("Record test suite", () => {
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
