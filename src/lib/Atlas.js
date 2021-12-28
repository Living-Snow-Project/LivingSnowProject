const AtlasTypes = Object.freeze({
  Undefined: 0,
  SnowAlgae: 1,
  DirtOrDebris: 2,
  Ash: 3,
  WhiteSnow: 4,
  MixOfAlgaeAndDirt: 5,
  ForestOrVegetation: 6,
  Other: 7,
  Max: 8,
});

const AtlasTypesTable = [
  { value: AtlasTypes.SnowAlgae, label: "Snow Algae" },
  { value: AtlasTypes.DirtOrDebris, label: "Dirt or Debris" },
  { value: AtlasTypes.Ash, label: "Ash" },
  { value: AtlasTypes.WhiteSnow, label: "White Snow" },
  { value: AtlasTypes.MixOfAlgaeAndDirt, label: `Mix of Algae and Dirt` },
  { value: AtlasTypes.ForestOrVegetation, label: `Forest or Vegetation` },
  { value: AtlasTypes.Other, label: `Other` },
];

const getAtlasItem = (atlasType) =>
  atlasType > AtlasTypes.Undefined && atlasType < AtlasTypes.Max
    ? AtlasTypesTable[atlasType - 1]
    : AtlasTypes.Undefined;

export { AtlasTypes, AtlasTypesTable, getAtlasItem };
