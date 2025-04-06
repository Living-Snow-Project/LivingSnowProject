import { AlgaeRecordV3 } from "@livingsnow/record";
import { AlgaeRecordResponseV3 } from "./types";
declare const RecordsApiV3: {
    baseUrl: string;
    getUrl: (page?: string) => string;
    postUrl: string;
    postPhotoUrl: (recordId: string) => string;
    post: (record: AlgaeRecordV3, requestId: string) => Promise<AlgaeRecordV3>;
    get: (page?: string) => Promise<AlgaeRecordResponseV3>;
    getAll: () => Promise<AlgaeRecordResponseV3>;
    postPhoto: (recordId: string, photoUri: string, requestId: string) => Promise<void>;
    postMicrograph: (recordId: string, micrographFile: File) => Promise<void>;
};
export { RecordsApiV3 };
//# sourceMappingURL=records.d.ts.map