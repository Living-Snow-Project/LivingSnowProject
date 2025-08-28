import { AlgaeColor } from "@livingsnow/record";
import { getAllAlgaeColorSelectorItems } from "../Color";
import { AlgaeColorDescription } from "../../constants/Strings";

const getAlgaeColorSelectorItem = (color: AlgaeColor) => {
  const result = getAllAlgaeColorSelectorItems().find(
    (cur) => cur.value == color,
  );

  if (result == undefined) {
    return { value: "Other", label: AlgaeColorDescription.Other };
  }

  return result;
};

describe("Algae Color test suite", () => {
  test("getAlgaeColorSelectorItem values", () => {
    let cur = getAlgaeColorSelectorItem("Red");
    expect(cur.label).toEqual(AlgaeColorDescription.Red);

    cur = getAlgaeColorSelectorItem("Pink");
    expect(cur.label).toEqual(AlgaeColorDescription.Pink);

    cur = getAlgaeColorSelectorItem("Grey");
    expect(cur.label).toEqual(AlgaeColorDescription.Grey);

    cur = getAlgaeColorSelectorItem("Green");
    expect(cur.label).toEqual(AlgaeColorDescription.Green);

    cur = getAlgaeColorSelectorItem("Yellow");
    expect(cur.label).toEqual(AlgaeColorDescription.Yellow);

    cur = getAlgaeColorSelectorItem("Orange");
    expect(cur.label).toEqual(AlgaeColorDescription.Orange);

    cur = getAlgaeColorSelectorItem("Other");
    expect(cur.label).toEqual(AlgaeColorDescription.Other);
  });

  test("getAlgaeColorPickerItem Select a color", () => {
    expect(getAlgaeColorSelectorItem("garbage" as AlgaeColor).label).toEqual(
      AlgaeColorDescription.Other,
    );
  });
});
