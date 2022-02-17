/* eslint-disable import/no-extraneous-dependencies */
import { rest } from "msw";
import { setupServer } from "msw/node";
import { handlers, mockBackend } from "./handlers";
import { recordsUri, uploadPhotoUri } from "../lib/Network";

const mswServer = setupServer(...handlers);
const networkError = "totally crazy random error";
const internalServerError = "500: Internal Server Error";

const reset = () => {
  mswServer.resetHandlers();
  mockBackend.resetBackend();
};

const postRecordNetworkError = (): string => {
  mswServer.use(
    rest.post(recordsUri, (req, res) => res.networkError(networkError))
  );

  return networkError;
};

const postRecordInternalServerError = (): string => {
  mswServer.use(rest.post(recordsUri, (req, res, ctx) => res(ctx.status(500))));

  return internalServerError;
};

const getRecordsNetworkError = (): string => {
  mswServer.use(
    rest.get(recordsUri, (req, res) => res.networkError(networkError))
  );

  return networkError;
};

const getRecordsInternalServerError = (): string => {
  mswServer.use(rest.get(recordsUri, (req, res, ctx) => res(ctx.status(500))));

  return internalServerError;
};

const postPhotoNetworkError = (recordId: number): string => {
  mswServer.use(
    rest.post(uploadPhotoUri(recordId), (req, res) =>
      res.networkError(networkError)
    )
  );

  return networkError;
};

const postPhotoInternalServerError = (recordId: number): string => {
  mswServer.use(
    rest.post(uploadPhotoUri(recordId), (req, res, ctx) => res(ctx.status(500)))
  );

  return internalServerError;
};

const server = {
  ...mswServer,
  reset,
  getNextRecordId: mockBackend.getNextRecordId.bind(mockBackend),
  postRecordNetworkError,
  postRecordInternalServerError,
  getRecordsNetworkError,
  getRecordsInternalServerError,
  postPhotoNetworkError,
  postPhotoInternalServerError,
};

export default server;
