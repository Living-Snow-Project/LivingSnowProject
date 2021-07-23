export const AtlasTypes = {
  Undefined: 0,
  SnowAlgae: 1,
  DirtOrDebris: 2,
  Ash: 3,
  WhiteSnow: 4,
  MixOfAlgaeAndDirt: 5,
  ForestOrVegetation: 6,
  Other: 7
};

const AtlasTypeDescription = [];
AtlasTypeDescription[AtlasTypes.Undefined] = `Undefined`;
AtlasTypeDescription[AtlasTypes.SnowAlgae] = `Snow Algae`;
AtlasTypeDescription[AtlasTypes.DirtOrDebris] = `Dirt or Debris`;
AtlasTypeDescription[AtlasTypes.Ash] = `Ash`;
AtlasTypeDescription[AtlasTypes.WhiteSnow] = `White Snow`;
AtlasTypeDescription[AtlasTypes.MixOfAlgaeAndDirt] = `Mix of Algae and Dirt`;
AtlasTypeDescription[AtlasTypes.ForestOrVegetation] = `Forest or Vegetation`;
AtlasTypeDescription[AtlasTypes.Other] = `Other`;

export function getAtlasTypeText(atlasType) {
  return atlasType ? AtlasTypeDescription[atlasType] : undefined;
}