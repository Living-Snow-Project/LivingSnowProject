import { AlgaeRecordV3 } from "@livingsnow/record/src/types";
import { PhotosResponseV2 } from "../v2/types";

export type DataResponseV3 = AlgaeRecordV3 & {
  photos: PhotosResponseV2;
};

export type AlgaeRecordResponseV3 = {
  object: "list";
  data: DataResponseV3[];
  meta: {
    result_count: number;
    next_token: string;
  };
};
