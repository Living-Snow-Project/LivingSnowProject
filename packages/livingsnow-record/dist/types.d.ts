export type Photo = {
    uri: string;
    width: number;
    height: number;
};
declare const AlgaeSizeArray: readonly ["Select a size", "Fist", "Shoe Box", "Coffee Table", "Car", "Bus", "Playground", "Sports Field", "Other"];
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
declare const WhatIsUnderSnowpackArray: readonly ["Vegetation", "Rocks", "Soil", "Pond or tarn", "Lake", "Stream", "Mixed", "I don't know"];
export type WhatIsUnderSnowpack = (typeof WhatIsUnderSnowpackArray)[number];
declare const SurfaceImpurityArray: readonly ["Select impurities", "Orange Dust", "Soot", "Soil", "Vegetation", "Pollen", "Evidence of Animals", "Other"];
export type SurfaceImpurity = (typeof SurfaceImpurityArray)[number];
export type AlgaeRecordV3 = AlgaeRecord & {
    isOnGlacier?: boolean;
    seeExposedIceOrWhatIsUnderSnowpack?: string | WhatIsUnderSnowpack;
    snowpackDepth?: string;
    bloomDepth?: string;
    impurities?: SurfaceImpurity[];
};
export {};
//# sourceMappingURL=types.d.ts.map