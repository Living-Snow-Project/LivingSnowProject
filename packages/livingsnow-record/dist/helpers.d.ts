import { AlgaeRecord, AlgaeRecordType, AppPhoto } from "./types";
export declare const makeExampleAppPhoto: ({ isLocal, uri, size, width, height, }?: {
    isLocal?: boolean | undefined;
    uri?: string | undefined;
    size?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
}) => AppPhoto;
export declare const isSample: (type: AlgaeRecordType) => boolean;
export declare const makeExampleRecord: (type: AlgaeRecordType) => AlgaeRecord;
export declare function jsonToRecord<T>(json: string): T;
export declare function recordDateFormat(date: Date): string;
//# sourceMappingURL=helpers.d.ts.map