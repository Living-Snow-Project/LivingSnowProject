/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { recordsUri } from "../lib/Network";
import serviceEndpoint from "../constants/Service";
import { Record } from "../record/Record";

let curRecordId = 0;
let records: Array<Record> = new Array<Record>();

const resetServer = () => {
  curRecordId = 0;
  records = new Array<Record>();
};

const handlers = [
  // Handles a POST /api/records request
  rest.post(recordsUri, (req, res, ctx) => {
    if (typeof req.body === "object" && req.body !== null) {
      const { body } = req;
      curRecordId += 1;
      body.id = curRecordId;
      records.push(body as Record);
      return res(ctx.status(200), ctx.json(body));
    }

    return res(ctx.status(200));
  }),

  // Handles a GET /api/records request
  rest.get(recordsUri, (req, res, ctx) => {
    if (records.length > 0) {
      return res(ctx.status(200), ctx.json(records));
    }

    return res(ctx.status(404));
  }),

  // Handles a POST /api/records/{recordId}/photo request
  // TODO: will likely implement more here once downloadPhoto is supported
  rest.post(`${serviceEndpoint}/api/records/:recordId/photo`, (req, res, ctx) =>
    res(ctx.status(200))
  ),
];

export { handlers, resetServer };
