// photos have various states but these fields are common across them
export type Photo = {
  uri: string;
  width: number;
  height: number;
};

export enum AlgaeSize {
  SELECT_A_SIZE = "Select a size",
  FIST = "Fist",
  DINNER_PLATE = "Dinner Plate",
  BICYCLE = "Bicycle",
  CAR = "Car",
  BUS = "Bus",
  HOUSE = "Small or Medium-Sized House",
  SPORTS_FIELD = "Sports Field",
  OTHER = "Other",
}

const AlgaeColorArray = [
  "Select colors",
  "Red",
  "Pink",
  "Grey",
  "Green",
  "Orange",
  "Yellow",
  "Other",
] as const;

export enum BloomDepthThicknessSelection {
  SELECT_A_DEPTH = "Select a depth",
  SURFACE = "Surface",
  TWO_CM = "2 cm",
  FIVE_CM = "5 cm",
  TEN_CM = "10 cm",
  GREATER_THAN_TEN_CM = "Greater than 10 cm",
  OTHER = "Other",
}

export enum ImpuritiesSelection {
  ORANGE_DUST = "Orange Dust",
  SOOT = "Soot",
  SOIL = "Soil",
  VEGETATION = "Vegetation",
  POLLEN = "Pollen",
  EVIDENCE_OF_ANIMALS = "Evidence of Animals",
  OTHER = "Other (describe in notes)",
}

export enum SnowpackThicknessSelection {
  SELECT_A_THICKNESS = "Select a thickness",
  LESS_THAN_10_CM = "Less than 10 cm",
  BETWEEN_10_CM_30_CM = "Between 10 cm - 30 cm",
  THIRTY_CM_TO_1_M = "30 cm - 1 m",
  GREATER_THAN_1_M = "Greater than 1 m",
  I_DONT_KNOW = "I don't know",
}

export enum UnderSnowpackSelection {
  SELECT_AN_OPTION = "Select an option",
  VEGETATION = "Vegetation",
  ROCKS = "Rocks",
  SOIL = "Soil",
  LAKE = "Lake",
  STREAM = "Stream",
  MIXED = "Mixed",
  I_DONT_KNOW = "I don't know",
}

export type AlgaeColor = (typeof AlgaeColorArray)[number];

const AlgaeRecordTypeArray = ["Sample", "Sighting", "Undefined"] as const;

export type AlgaeRecordType = (typeof AlgaeRecordTypeArray)[number];

export enum ExposedIceSelection {
  YES = "Yes",
  NO = "No",
}

export enum OnOffGlacierSelection {
  YES = "Yes",
  NO = "No",
}

export type AlgaeRecord = {
  id: string;
  bloomDepth: BloomDepthThicknessSelection;
  colors: AlgaeColor[];
  date: Date;
  impurities: ImpuritiesSelection[];
  latitude: number;
  longitude: number;
  size: AlgaeSize;
  type: AlgaeRecordType;
  locationDescription?: string;
  name?: string;
  notes?: string;
  onOffGlacier: OnOffGlacierSelection;
  organization?: string;
  snowpackThickness: SnowpackThicknessSelection;
  underSnowpack: UnderSnowpackSelection;
  tubeId?: string;
  exposedIce: ExposedIceSelection;
};

// Record v3 types

// required: user selects one of the following options
const WhatIsUnderSnowpackArray = [
  "Vegetation",
  "Rocks",
  "Soil",
  "Pond or tarn",
  "Lake",
  "Stream",
  "Mixed",
  "I don't know"
] as const;

export type WhatIsUnderSnowpack = (typeof WhatIsUnderSnowpackArray)[number];

// optional?: user can select more than one of the following options
const SurfaceImpurityArray = [
  "Select impurities",
  "Orange Dust",
  "Soot",
  "Soil",
  "Vegetation",
  "Pollen",
  "Evidence of Animals",
  "Other",
] as const;

export type SurfaceImpurity = (typeof SurfaceImpurityArray)[number];

export type AlgaeRecordV3 = AlgaeRecord & {
  isOnGlacier?: boolean;
  // if 'isOnGlacier' is true (yes), this is either Yes or No (string)
  // if 'isOnGlacier' is false (no), this is a description of what is underneath (WhatIsUnderSnowpack)
  seeExposedIceOrWhatIsUnderSnowpack?: string | WhatIsUnderSnowpack;
  snowpackDepth?: string; // < 10cm, 10cm – 30cm, 31cm - 1m, > 1m, exact measurement, I don’t know
  bloomDepth?: string; // surface, 2cm, 5cm, 10cm, > 10cm, exact measurement
  impurities?: SurfaceImpurity[];
};