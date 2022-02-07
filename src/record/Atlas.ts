import { AtlasDescription } from "../constants/Strings";

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
  { value: AtlasType.SnowAlgae, label: AtlasDescription.SnowAlgae },
  { value: AtlasType.DirtOrDebris, label: AtlasDescription.DirtOrDebris },
  { value: AtlasType.Ash, label: AtlasDescription.Ash },
  { value: AtlasType.WhiteSnow, label: AtlasDescription.WhiteSnow },
  {
    value: AtlasType.MixOfAlgaeAndDirt,
    label: AtlasDescription.MixOfAlgaeAndDirt,
  },
  {
    value: AtlasType.ForestOrVegetation,
    label: AtlasDescription.ForestOrVegetation,
  },
  { value: AtlasType.Other, label: AtlasDescription.Other },
];

const getAtlasPickerItem = (type: AtlasType): AtlasPickerItem =>
  type > AtlasType.Undefined && type < AtlasType.Max
    ? AtlasPickerItems[type]
    : { value: AtlasType.Undefined, label: AtlasDescription.Undefined };

const getAllAtlasPickerItems = (): AtlasPickerItem[] => AtlasPickerItems;

export { AtlasType, getAtlasPickerItem, getAllAtlasPickerItems };
