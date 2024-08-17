import { Photo } from "@livingsnow/record/src/types";
export type AppPhotoResponse = Photo & {
    size: number;
};
export type MicrographResponse = AppPhotoResponse & {
    micrographId: number;
};
//# sourceMappingURL=types.d.ts.map