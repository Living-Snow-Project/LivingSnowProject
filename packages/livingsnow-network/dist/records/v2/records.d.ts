import { AlgaeRecord, AppPhoto } from "@livingsnow/record";
import { AlgaeRecordResponseV2 } from "./types";
declare const RecordsApiV2: {
    baseUrl: string;
    getUrl: (page?: string) => string;
    postUrl: string;
    postPhotoUrl: (recordId: number) => string;
    post: (record: AlgaeRecord) => Promise<AlgaeRecord>;
    get: (page?: string) => Promise<AlgaeRecordResponseV2>;
    getAll: () => Promise<AlgaeRecordResponseV2>;
    postPhoto: (recordId: number, photo: AppPhoto) => Promise<void>;
};
export { RecordsApiV2 };
//# sourceMappingURL=records.d.ts.map