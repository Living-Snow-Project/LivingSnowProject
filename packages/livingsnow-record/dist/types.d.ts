export type Photo = {
    uri: string;
    width: number;
    height: number;
};
declare const AlgaeSizeArray: readonly ["Select a size", "Fist", "Dinner Plate", "Bicycle", "Car", "Bus", "House", "Sports Field", "Other"];
export type AlgaeSize = (typeof AlgaeSizeArray)[number];
declare const AlgaeColorArray: readonly ["Select colors", "Red", "Pink", "Grey", "Green", "Orange", "Yellow", "Other"];
export type AlgaeColor = (typeof AlgaeColorArray)[number];
declare const AlgaeRecordTypeArray: readonly ["Sample", "Sighting", "Undefined"];
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
declare const SeeExposedIceArray: readonly ["Yes", "No"];
export type SeeExposedIce = (typeof SeeExposedIceArray)[number];
declare const WhatIsUnderSnowpackArray: readonly ["Select what is under snowpack", "Vegetation", "Rocks", "Soil", "Pond or tarn", "Lake", "Stream", "Mixed", "I Don't Know"];
export type WhatIsUnderSnowpack = (typeof WhatIsUnderSnowpackArray)[number];
declare const SnowpackDepthArray: readonly ["Select snowpack depth", "< 10cm", "10cm - 30cm", "30cm - 1m", "> 1m", "Other"];
export type SnowpackDepth = (typeof SnowpackDepthArray)[number];
declare const BloomDepthArray: readonly ["Select bloom depth", "Surface", "2cm", "5cm", "10cm", "> 10cm", "Other"];
export type BloomDepth = (typeof BloomDepthArray)[number];
declare const SurfaceImpurityArray: readonly ["Select impurities", "Orange Dust", "Soot", "Soil", "Vegetation", "Pollen", "Evidence of Animals", "Other"];
export type SurfaceImpurity = (typeof SurfaceImpurityArray)[number];
export type AlgaeRecordV3 = AlgaeRecord & {
    isOnGlacier?: boolean;
    seeExposedIceOrWhatIsUnderSnowpack?: SeeExposedIce | WhatIsUnderSnowpack;
    snowpackDepth?: SnowpackDepth;
    bloomDepth?: BloomDepth;
    impurities?: SurfaceImpurity[];
};
export {};
//# sourceMappingURL=types.d.ts.map