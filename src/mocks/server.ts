/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers, resetServer } from "./handlers";

const server = setupServer(...handlers);
export { server, rest, resetServer };
