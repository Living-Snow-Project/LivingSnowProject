import { AlgaeRecord } from "@livingsnow/record/src/types";

export type AlgaeRecordResponseV2 = {
  object: "list";
  data: AlgaeRecord[];
  meta: {
    result_count: number;
    next_token: string;
  };
};
