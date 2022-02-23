import { AtlasDescription } from "../constants/Strings";

type AtlasPickerItem = {
  value: AtlasType;
  label: string;
};

// specific format for RNPickerSelect
const atlasPickerItems: AtlasPickerItem[] = [
  { value: "Snow Algae", label: AtlasDescription.SnowAlgae },
  { value: "Dirt or Debris", label: AtlasDescription.DirtOrDebris },
  { value: "Ash", label: AtlasDescription.Ash },
  { value: "White Snow", label: AtlasDescription.WhiteSnow },
  {
    value: "Mix of Algae and Dirt",
    label: AtlasDescription.MixOfAlgaeAndDirt,
  },
  {
    value: "Forest or Vegetation",
    label: AtlasDescription.ForestOrVegetation,
  },
  { value: "Other", label: AtlasDescription.Other },
];

const getAtlasPickerItem = (type: AtlasType): AtlasPickerItem => {
  const result = atlasPickerItems.find((cur) => cur.value === type);

  if (result === undefined) {
    return { value: "Undefined", label: AtlasDescription.Undefined };
  }

  return result;
};

const getAllAtlasPickerItems = (): AtlasPickerItem[] => atlasPickerItems;

export { getAtlasPickerItem, getAllAtlasPickerItems };
