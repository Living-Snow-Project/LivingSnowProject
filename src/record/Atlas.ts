enum AtlasType {
  Undefined = -1,
  SnowAlgae,
  DirtOrDebris,
  Ash,
  WhiteSnow,
  MixOfAlgaeAndDirt,
  ForestOrVegetation,
  Other,
  Max,
}

type AtlasPickerItem = {
  value: AtlasType;
  label: string;
};

// specific format for RNPickerSelect
const AtlasPickerItems: AtlasPickerItem[] = [
  { value: AtlasType.SnowAlgae, label: "Snow Algae" },
  { value: AtlasType.DirtOrDebris, label: "Dirt or Debris" },
  { value: AtlasType.Ash, label: "Ash" },
  { value: AtlasType.WhiteSnow, label: "White Snow" },
  { value: AtlasType.MixOfAlgaeAndDirt, label: `Mix of Algae and Dirt` },
  { value: AtlasType.ForestOrVegetation, label: `Forest or Vegetation` },
  { value: AtlasType.Other, label: `Other (please describe in notes)` },
];

const getAtlasPickerItem = (type: AtlasType): AtlasPickerItem =>
  type > AtlasType.Undefined && type < AtlasType.Max
    ? AtlasPickerItems[type]
    : { value: AtlasType.Undefined, label: "Undefined" };

const getAllAtlasPickerItems = (): AtlasPickerItem[] => AtlasPickerItems;

export { AtlasType, getAtlasPickerItem, getAllAtlasPickerItems };
