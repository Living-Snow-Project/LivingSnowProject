import { AlgaeRecord } from "@livingsnow/record";
import { rest } from "msw";

import { RecordsApiV2, AlgaeRecordResponseV2 } from "../src";

type MockBackend = {
  curRecordId: number;
  records: AlgaeRecord[];
  recordsUri: string;
  photosUri: string;
  resetBackend: () => void;
};

const mockBackend: MockBackend = {
  curRecordId: 0,
  records: [],
  recordsUri: RecordsApiV2.baseUrl,
  photosUri: `${RecordsApiV2.baseUrl}/:recordId/photo`,

  resetBackend() {
    this.curRecordId = 0;
    this.records = [];
  },
};

const handlersV2 = [
  // Handles a POST /api/v2.0/records request
  rest.post(RecordsApiV2.baseUrl, async (req, res, ctx) => {
    const body: AlgaeRecord = await req.json();

    mockBackend.curRecordId += 1;
    body.id = mockBackend.curRecordId;
    mockBackend.records.push(body);
    return res(ctx.status(200), ctx.json(body));
  }),

  // Handles a GET /api/v2.0/records request
  rest.get(RecordsApiV2.baseUrl, (req, res, ctx) => {
    const response: AlgaeRecordResponseV2 = {
      object: "list",
      data: mockBackend.records,
      meta: {
        result_count: mockBackend.records.length,
        next_token: "",
      },
    };

    if (mockBackend.records.length > 0) {
      return res(ctx.status(200), ctx.json(response));
    }

    return res(ctx.status(404));
  }),

  // Handles a POST /api/records/{recordId}/photo request
  rest.post(mockBackend.photosUri, (req, res, ctx) => res(ctx.status(200))),
];

export { handlersV2 as handlers, mockBackend };
