export declare type AppPhoto = {
    uri: string;
    size: number;
    width: number;
    height: number;
};
declare const AlgaeSizeArray: readonly ["Select a size", "Fist", "Shoe Box", "Coffee Table", "Car", "Bus", "Playground", "Sports Field", "Other"];
export declare type AlgaeSize = typeof AlgaeSizeArray[number];
declare const AlgaeColorArray: readonly ["Select colors", "Red", "Pink", "Grey", "Green", "Orange", "Yellow", "Other"];
export declare type AlgaeColor = typeof AlgaeColorArray[number];
declare const AlgaeRecordTypeArray: readonly ["Sample", "Sighting", "Undefined"];
export declare type AlgaeRecordType = typeof AlgaeRecordTypeArray[number];
export declare type AlgaeRecord = {
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