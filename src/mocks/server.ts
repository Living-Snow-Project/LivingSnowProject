/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers, mockBackend } from "./handlers";

const mswServer = setupServer(...handlers);
const networkError = "totally crazy random error";
const internalServerError = "500: Internal Server Error";

const reset = () => {
  mswServer.resetHandlers();
  mockBackend.resetBackend();
};

const postRecordNetworkError = (): string => {
  mswServer.use(
    rest.post(mockBackend.recordsUri, (req, res) =>
      res.networkError(networkError)
    )
  );

  return networkError;
};

const postRecordInternalServerError = (): string => {
  mswServer.use(
    rest.post(mockBackend.recordsUri, (req, res, ctx) => res(ctx.status(500)))
  );

  return internalServerError;
};

const getRecordsNetworkError = (): string => {
  mswServer.use(
    rest.get(mockBackend.recordsUri, (req, res) =>
      res.networkError(networkError)
    )
  );

  return networkError;
};

const getRecordsInternalServerError = (): string => {
  mswServer.use(
    rest.get(mockBackend.recordsUri, (req, res, ctx) => res(ctx.status(500)))
  );

  return internalServerError;
};

const postPhotoNetworkError = (): string => {
  mswServer.use(
    rest.post(mockBackend.photosUri, (req, res) =>
      res.networkError(networkError)
    )
  );

  return networkError;
};

const postPhotoInternalServerError = (): string => {
  mswServer.use(
    rest.post(mockBackend.photosUri, (req, res, ctx) => res(ctx.status(500)))
  );

  return internalServerError;
};

const server = {
  ...mswServer,
  reset,
  postRecordNetworkError,
  postRecordInternalServerError,
  getRecordsNetworkError,
  getRecordsInternalServerError,
  postPhotoNetworkError,
  postPhotoInternalServerError,
};

export default server;
