// photos have various states but these fields are common across them
export type Photo = {
  uri: string;
  width: number;
  height: number;
};

const AlgaeSizeArray = [
  "Select a size",
  "Fist",
  "Dinner Plate",
  "Bicycle",
  "Car",
  "Bus",
  "House",
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

// Record v3 types (all optional)
const SeeExposedIceArray = ["Yes", "No"] as const;

export type SeeExposedIce = (typeof SeeExposedIceArray)[number];

const WhatIsUnderSnowpackArray = [
  "Select what is under snowpack",
  "Vegetation",
  "Rocks",
  "Soil",
  "Pond or tarn",
  "Lake",
  "Stream",
  "Mixed",
  "I Don't Know",
] as const;

export type WhatIsUnderSnowpack = (typeof WhatIsUnderSnowpackArray)[number];

const SnowpackDepthArray = [
  "Select snowpack depth",
  "< 10cm",
  "10cm - 30cm",
  "30cm - 1m",
  "> 1m",
  "Other", // describe in Notes
] as const;

export type SnowpackDepth = (typeof SnowpackDepthArray)[number];

const BloomDepthArray = [
  "Select bloom depth",
  "Surface",
  "2cm",
  "5cm",
  "10cm",
  "> 10cm",
  "Other", // describe in Notes
] as const;

export type BloomDepth = (typeof BloomDepthArray)[number];

// more than one can be selected
const SurfaceImpurityArray = [
  "Select impurities",
  "Orange Dust",
  "Soot",
  "Soil",
  "Vegetation",
  "Pollen",
  "Evidence of Animals",
  "Other", //describe in Notes
] as const;

export type SurfaceImpurity = (typeof SurfaceImpurityArray)[number];

export type AlgaeRecordV3 = AlgaeRecord & {
  isOnGlacier?: boolean;
  // if 'isOnGlacier' is true (yes), this is either "Yes" or "No"
  // if 'isOnGlacier' is false (no), this is a description of what is underneath snowpack
  seeExposedIceOrWhatIsUnderSnowpack?: SeeExposedIce | WhatIsUnderSnowpack;
  snowpackDepth?: SnowpackDepth;
  bloomDepth?: BloomDepth;
  impurities?: SurfaceImpurity[];
};
