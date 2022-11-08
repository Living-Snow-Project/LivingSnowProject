import { AlgaeSize } from "@livingsnow/record";
import { getAlgaeSizePickerItem } from "../Size";
import { AlgaeSizeDescription } from "../../constants/Strings";

describe("Algae Size test suite", () => {
  test("getAlgaeSizePickerItem values", () => {
    let cur = getAlgaeSizePickerItem("Select a size");
    expect(cur.label).toEqual(AlgaeSizeDescription.Select);

    cur = getAlgaeSizePickerItem("Fist");
    expect(cur.label).toEqual(AlgaeSizeDescription.Fist);

    cur = getAlgaeSizePickerItem("Shoe Box");
    expect(cur.label).toEqual(AlgaeSizeDescription.ShoeBox);

    cur = getAlgaeSizePickerItem("Coffee Table");
    expect(cur.label).toEqual(AlgaeSizeDescription.CoffeeTable);

    cur = getAlgaeSizePickerItem("Car");
    expect(cur.label).toEqual(AlgaeSizeDescription.Car);

    cur = getAlgaeSizePickerItem("Bus");
    expect(cur.label).toEqual(AlgaeSizeDescription.Bus);

    cur = getAlgaeSizePickerItem("Playground");
    expect(cur.label).toEqual(AlgaeSizeDescription.Playground);

    cur = getAlgaeSizePickerItem("Sports Field");
    expect(cur.label).toEqual(AlgaeSizeDescription.SportsField);

    cur = getAlgaeSizePickerItem("Other");
    expect(cur.label).toEqual(AlgaeSizeDescription.Other);
  });

  test("getAlgaeSizePickerItem Select a size", () => {
    expect(getAlgaeSizePickerItem("garbage" as AlgaeSize).label).toEqual(
      AlgaeSizeDescription.Other
    );
  });
});
