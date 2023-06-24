import { AlgaeRecord, AlgaeRecordType, AppPhoto } from "./types";
export declare const makeExamplePhoto: ({ isLocal, uri, width, height, }?: {
    isLocal?: boolean | undefined;
    uri?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}) => AppPhoto;
export declare const isSample: (type: AlgaeRecordType) => boolean;
export declare const makeExampleRecord: (type: AlgaeRecordType) => AlgaeRecord;
export declare function jsonToRecord<T>(json: string): T;
export declare function recordDateFormat(date: Date): string;
//# sourceMappingURL=helpers.d.ts.map