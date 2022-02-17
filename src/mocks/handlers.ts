/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { recordsUri } from "../lib/Network";
import serviceEndpoint from "../constants/Service";
import { Record } from "../record/Record";

type MockBackend = {
  curRecordId: number;
  records: Array<Record>;
  resetBackend: () => void;
  getNextRecordId: () => number;
};

const mockBackend: MockBackend = {
  curRecordId: 0,
  records: new Array<Record>(),

  resetBackend() {
    this.curRecordId = 0;
    this.records = new Array<Record>();
  },

  getNextRecordId() {
    return this.curRecordId + 1;
  },
};

const handlers = [
  // Handles a POST /api/records request
  rest.post(recordsUri, (req, res, ctx) => {
    if (typeof req.body === "object" && req.body !== null) {
      const { body } = req;
      mockBackend.curRecordId += 1;
      body.id = mockBackend.curRecordId;
      mockBackend.records.push(body as Record);
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
  rest.post(`${serviceEndpoint}/api/records/:recordId/photo`, (req, res, ctx) =>
    res(ctx.status(200))
  ),
];

export { handlers, mockBackend };
