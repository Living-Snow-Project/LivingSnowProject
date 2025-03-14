// photos have various states but these fields are common across them
export type Photo = {
  uri: string;
  width: number;
  height: number;
};

const AlgaeSizeArray = [
  "Select a size",
  "Fist",
  "Shoe Box",
  "Coffee Table",
  "Car",
  "Bus",
  "Playground",
  "Sports Field",
  "Other",
] as const;

export type AlgaeSize = (typeof AlgaeSizeArray)[number];

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

export type AlgaeColor = (typeof AlgaeColorArray)[number];

const AlgaeRecordTypeArray = ["Sample", "Sighting", "Undefined"] as const;

export type AlgaeRecordType = (typeof AlgaeRecordTypeArray)[number];

export type AlgaeRecord = {
  id: string;
  colors: AlgaeColor[];
  date: Date;
  latitude: number;
  longitude: number;
  size: AlgaeSize;
  type: AlgaeRecordType;

  locationDescription?: string;
  name?: string;
  notes?: string;
  organization?: string;
  tubeId?: string;
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
  isOnGlacier: boolean;
  // if 'isOnGlacier' is true (yes), this is either Yes or No (string)
  // if 'isOnGlacier' is false (no), this is a description of what is underneath (WhatIsUnderSnowpack)
  seeExposedIceOrWhatIsUnderSnowpack: string | WhatIsUnderSnowpack;
  snowpackDepth: string; // < 10cm, 10cm – 30cm, 31cm - 1m, > 1m, exact measurement, I don’t know
  bloomDepth: string; // surface, 2cm, 5cm, 10cm, > 10cm, exact measurement

  impurities?: SurfaceImpurity[];
};