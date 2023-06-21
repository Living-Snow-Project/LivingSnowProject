export declare type Photo = {
    uri: string;
    width: number;
    height: number;
    size: number;
};
export declare type PendingPhoto = Photo & {
    id: number;
};
export declare type SelectedPhoto = Omit<Photo, "size"> & {
    id: string;
};
declare const AlgaeSizeArray: readonly ["Select a size", "Fist", "Shoe Box", "Coffee Table", "Car", "Bus", "Playground", "Sports Field", "Other"];
export declare type AlgaeSize = typeof AlgaeSizeArray[number];
declare const AlgaeColorArray: readonly ["Select colors", "Red", "Pink", "Grey", "Green", "Orange", "Yellow", "Other"];
export declare type AlgaeColor = typeof AlgaeColorArray[number];
declare const AlgaeRecordTypeArray: readonly ["Sample", "Sighting", "Undefined"];
export declare type AlgaeRecordType = typeof AlgaeRecordTypeArray[number];
export declare type AlgaeRecord = {
    id: number;
    type: AlgaeRecordType;
    name?: string;
    organization?: string;
    date: Date;
    latitude: number;
    longitude: number;
    size: AlgaeSize;
    colors: AlgaeColor[];
    tubeId?: string;
    locationDescription?: string;
    notes?: string;
    photos?: Photo[];
};
export {};
//# sourceMappingURL=types.d.ts.map