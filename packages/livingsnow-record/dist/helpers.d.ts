import { AlgaeRecord, AlgaeRecordType, PendingPhoto, Photo } from "./types";
export declare const makeExamplePhoto: ({ isLocal, uri, size, width, height, }?: {
    isLocal?: boolean | undefined;
    uri?: string | undefined;
    size?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
}) => Photo;
export declare const makeExamplePendingPhoto: ({ isLocal, id, uri, size, width, height, }?: {
    isLocal?: boolean | undefined;
    id?: number | undefined;
    uri?: string | undefined;
    size?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
}) => PendingPhoto;
export declare const isSample: (type: AlgaeRecordType) => boolean;
export declare const makeExampleRecord: (type: AlgaeRecordType) => AlgaeRecord;
export declare function jsonToRecord<T>(json: string): T;
export declare function recordDateFormat(date: Date): string;
//# sourceMappingURL=helpers.d.ts.map