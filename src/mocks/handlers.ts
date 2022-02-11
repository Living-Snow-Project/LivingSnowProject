/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import serviceEndpoint from "../constants/Service";
import { Record } from "../record/Record";

let id = 0;
const records: Record[] = [];

const handlers = [
  // Handles a POST /api/records request
  rest.post(`${serviceEndpoint}/api/records`, (req, res, ctx) => {
    if (typeof req.body === "object" && req.body !== null) {
      const { body } = req;
      id += 1;
      body.id = id;
      records.push(body as Record);
      return res(ctx.status(200), ctx.json(body));
    }

    return res(ctx.status(200));
  }),

  // Handles a GET /api/records request
  rest.get(`${serviceEndpoint}/api/records`, (req, res, ctx) => {
    if (records.length > 1) {
      return res(ctx.status(200), ctx.json(records));
    }

    return res(ctx.status(404));
  }),
];

export default handlers;
