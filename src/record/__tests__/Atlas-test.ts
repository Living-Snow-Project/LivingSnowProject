import { getAtlasPickerItem } from "../Atlas";
import { AtlasDescription } from "../../constants/Strings";

describe("Atlas test suite", () => {
  test("getAtlasPickerItem values", () => {
    let cur = getAtlasPickerItem("Snow Algae");
    expect(cur.label).toEqual(AtlasDescription.SnowAlgae);

    cur = getAtlasPickerItem("Dirt or Debris");
    expect(cur.label).toEqual(AtlasDescription.DirtOrDebris);

    cur = getAtlasPickerItem("Ash");
    expect(cur.label).toEqual(AtlasDescription.Ash);

    cur = getAtlasPickerItem("White Snow");
    expect(cur.label).toEqual(AtlasDescription.WhiteSnow);

    cur = getAtlasPickerItem("Mix of Algae and Dirt");
    expect(cur.label).toEqual(AtlasDescription.MixOfAlgaeAndDirt);

    cur = getAtlasPickerItem("Forest or Vegetation");
    expect(cur.label).toEqual(AtlasDescription.ForestOrVegetation);

    cur = getAtlasPickerItem("Other");
    expect(cur.label).toEqual(AtlasDescription.Other);
  });

  test("getAtlasPickerItem undefined atlas type", () => {
    expect(getAtlasPickerItem("Undefined").label).toEqual(
      AtlasDescription.Undefined
    );
  });
});
