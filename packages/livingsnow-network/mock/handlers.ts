import { AlgaeRecord } from "@livingsnow/record";
import { rest } from "msw";

import { recordsUri, serviceEndpoint } from "../src";

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
  recordsUri,
  photosUri: `${serviceEndpoint}/api/records/:recordId/photo`,

  resetBackend() {
    this.curRecordId = 0;
    this.records = [];
  },
};

const handlers = [
  // Handles a POST /api/records request
  rest.post(recordsUri, async (req, res, ctx) => {
    const body: AlgaeRecord = await req.json();

    mockBackend.curRecordId += 1;
    body.id = mockBackend.curRecordId;
    mockBackend.records.push(body);
    return res(ctx.status(200), ctx.json(body));
  }),

  // Handles a GET /api/records request
  rest.get(recordsUri, (req, res, ctx) => {
    if (mockBackend.records.length > 0) {
      return res(ctx.status(200), ctx.json(mockBackend.records));
    }

    return res(ctx.status(404));
  }),

  // Handles a POST /api/records/{recordId}/photo request
  // TODO: will likely implement more here once downloadPhoto is supported
  rest.post(mockBackend.photosUri, (req, res, ctx) => res(ctx.status(200))),
];

export { handlers, mockBackend };
