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
export {};
//# sourceMappingURL=types.d.ts.map