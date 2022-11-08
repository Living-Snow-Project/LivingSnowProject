/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { AlgaeRecord } from "@livingsnow/record";
import { recordsUri } from "../lib/Network";
import { serviceEndpoint } from "../constants/Service";

type MockBackend = {
  curRecordId: number;
  records: Array<AlgaeRecord>;
  recordsUri: string;
  photosUri: string;
  resetBackend: () => void;
};

const mockBackend: MockBackend = {
  curRecordId: 0,
  records: new Array<AlgaeRecord>(),
  recordsUri,
  photosUri: `${serviceEndpoint}/api/records/:recordId/photo`,

  resetBackend() {
    this.curRecordId = 0;
    this.records = new Array<AlgaeRecord>();
  },
};

const handlers = [
  // Handles a POST /api/records request
  rest.post(recordsUri, (req, res, ctx) => {
    if (typeof req.body === "object" && req.body !== null) {
      const { body } = req;
      mockBackend.curRecordId += 1;
      body.id = mockBackend.curRecordId;
      mockBackend.records.push(body as AlgaeRecord);
      return res(ctx.status(200), ctx.json(body));
    }

    return res(ctx.status(200));
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
