import { AlgaeSize } from "@livingsnow/record";
import { getAllAlgaeSizeSelectorItems } from "../Size";
import { AlgaeSizeDescription } from "../../constants/Strings";

const getAlgaeSizeSelectorItem = (size: AlgaeSize) => {
  const result = getAllAlgaeSizeSelectorItems().find(
    (cur) => cur.value == size,
  );

  if (result == undefined) {
    return { value: "Other", label: AlgaeSizeDescription.Other };
  }

  return result;
};

describe("Algae Size test suite", () => {
  test("getAlgaeSizeSelectorItem values", () => {
    let cur = getAlgaeSizeSelectorItem("Fist");
    expect(cur.label).toEqual(AlgaeSizeDescription.Fist);

    cur = getAlgaeSizeSelectorItem("Shoe Box");
    expect(cur.label).toEqual(AlgaeSizeDescription.ShoeBox);

    cur = getAlgaeSizeSelectorItem("Coffee Table");
    expect(cur.label).toEqual(AlgaeSizeDescription.CoffeeTable);

    cur = getAlgaeSizeSelectorItem("Car");
    expect(cur.label).toEqual(AlgaeSizeDescription.Car);

    cur = getAlgaeSizeSelectorItem("Bus");
    expect(cur.label).toEqual(AlgaeSizeDescription.Bus);

    cur = getAlgaeSizeSelectorItem("Playground");
    expect(cur.label).toEqual(AlgaeSizeDescription.Playground);

    cur = getAlgaeSizeSelectorItem("Sports Field");
    expect(cur.label).toEqual(AlgaeSizeDescription.SportsField);

    cur = getAlgaeSizeSelectorItem("Other");
    expect(cur.label).toEqual(AlgaeSizeDescription.Other);
  });

  test("getAlgaeSizeSelectorItem bad value", () => {
    expect(getAlgaeSizeSelectorItem("garbage" as AlgaeSize).label).toEqual(
      AlgaeSizeDescription.Other,
    );
  });
});
