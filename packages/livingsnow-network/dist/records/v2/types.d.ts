import { AlgaeRecord } from "@livingsnow/record/src/types";
import { AppPhotoResponse } from "../../photos/types";
export declare type PhotosResponseV2 = {
    appPhotos?: AppPhotoResponse[];
    micrographs?: any[];
    dnaSequences?: any[];
};
export declare type DataResponseV2 = AlgaeRecord & {
    photos: PhotosResponseV2;
};
export declare type AlgaeRecordResponseV2 = {
    object: "list";
    data: DataResponseV2[];
    meta: {
        result_count: number;
        next_token: string;
    };
};
//# sourceMappingURL=types.d.ts.map