import { AlgaeRecord } from "@livingsnow/record/src/types";

import { AppPhotoResponse, MicrographResponse } from "../../photos/types";

export type PhotosResponseV2 = {
  appPhotos?: AppPhotoResponse[];
  micrographs?: MicrographResponse[];
  dnaSequences?: any[]; // TODO: what are the actual fields
};

export type DataResponseV2 = AlgaeRecord & {
  photos: PhotosResponseV2;
};

export type AlgaeRecordResponseV2 = {
  object: "list";
  data: DataResponseV2[];
  meta: {
    result_count: number;
    next_token: string;
  };
};

export { MicrographResponse };
