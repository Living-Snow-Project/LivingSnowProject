import { AtlasType, getAtlasPickerItem } from "../Atlas";
import { AtlasDescription } from "../../constants/Strings";

describe("Atlas test suite", () => {
  test("getAtlasPickerItem values", () => {
    let cur = getAtlasPickerItem(AtlasType.SnowAlgae);
    expect(cur.label).toEqual(AtlasDescription.SnowAlgae);

    cur = getAtlasPickerItem(AtlasType.DirtOrDebris);
    expect(cur.label).toEqual(AtlasDescription.DirtOrDebris);

    cur = getAtlasPickerItem(AtlasType.Ash);
    expect(cur.label).toEqual(AtlasDescription.Ash);

    cur = getAtlasPickerItem(AtlasType.WhiteSnow);
    expect(cur.label).toEqual(AtlasDescription.WhiteSnow);

    cur = getAtlasPickerItem(AtlasType.MixOfAlgaeAndDirt);
    expect(cur.label).toEqual(AtlasDescription.MixOfAlgaeAndDirt);

    cur = getAtlasPickerItem(AtlasType.ForestOrVegetation);
    expect(cur.label).toEqual(AtlasDescription.ForestOrVegetation);

    cur = getAtlasPickerItem(AtlasType.Other);
    expect(cur.label).toEqual(AtlasDescription.Other);
  });

  test("getAtlasPickerItem undefined atlas type", () => {
    expect(getAtlasPickerItem(AtlasType.Undefined).label).toEqual(
      AtlasDescription.Undefined
    );
  });
});
