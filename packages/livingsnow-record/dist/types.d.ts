export type Photo = {
    uri: string;
    width: number;
    height: number;
};
export declare enum AlgaeSize {
    SELECT_A_SIZE = "Select a size",
    FIST = "Fist",
    DINNER_PLATE = "Dinner Plate",
    BICYCLE = "Bicycle",
    CAR = "Car",
    BUS = "Bus",
    HOUSE = "Small or Medium-Sized House",
    SPORTS_FIELD = "Sports Field",
    OTHER = "Other"
}
declare const AlgaeColorArray: readonly ["Select colors", "Red", "Pink", "Grey", "Green", "Orange", "Yellow", "Other"];
export declare enum BloomDepthThicknessSelection {
    SELECT_A_DEPTH = "Select a depth",
    SURFACE = "Surface",
    TWO_CM = "2 cm",
    FIVE_CM = "5 cm",
    TEN_CM = "10 cm",
    GREATER_THAN_TEN_CM = "Greater than 10 cm",
    OTHER = "Other"
}
export declare enum SnowpackThicknessSelection {
    SELECT_A_THICKNESS = "Select a thickness",
    LESS_THAN_10_CM = "Less than 10 cm",
    BETWEEN_10_CM_30_CM = "Between 10 cm - 30 cm",
    THIRTY_CM_TO_1_M = "30 cm - 1 m",
    GREATER_THAN_1_M = "Greater than 1 m",
    I_DONT_KNOW = "I don't know"
}
export declare enum UnderSnowpackSelection {
    SELECT_AN_OPTION = "Select an option",
    VEGETATION = "Vegetation",
    ROCKS = "Rocks",
    SOIL = "Soil",
    LAKE = "Lake",
    STREAM = "Stream",
    MIXED = "Mixed",
    I_DONT_KNOW = "I don't know"
}
export type AlgaeColor = (typeof AlgaeColorArray)[number];
declare const AlgaeRecordTypeArray: readonly ["Sample", "Sighting", "Undefined"];
export type AlgaeRecordType = (typeof AlgaeRecordTypeArray)[number];
export declare enum ExposedIceSelection {
    YES = "Yes",
    NO = "No"
}
export declare enum OnOffGlacierSelection {
    YES = "Yes",
    NO = "No"
}
export type AlgaeRecord = {
    id: string;
    bloomDepth: BloomDepthThicknessSelection;
    colors: AlgaeColor[];
    date: Date;
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
export {};
//# sourceMappingURL=types.d.ts.map