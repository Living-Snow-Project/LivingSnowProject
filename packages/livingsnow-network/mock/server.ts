import { rest } from "msw";
import { setupServer } from "msw/node";

import { handlers, mockBackend } from "./handlers";

const mswServer = setupServer(...handlers);
const networkError = "totally crazy random error";
const internalServerError = "500: Internal Server Error";
let postPhotoCount: number = 0;

const reset = () => {
  mswServer.resetHandlers();
  mockBackend.resetBackend();
  postPhotoCount = 0;
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

const postPhotoSuccessThenFailure = (): string => {
  mswServer.use(
    rest.post(mockBackend.photosUri, (req, res, ctx) => {
      postPhotoCount += 1;

      if (postPhotoCount > 1) {
        return res.networkError(networkError);
      }

      return res(ctx.status(200));
    })
  );

  return networkError;
};

const server = {
  listen: () => mswServer.listen(),
  close: () => mswServer.close(),
  reset,
  postRecordNetworkError,
  postRecordInternalServerError,
  getRecordsNetworkError,
  getRecordsInternalServerError,
  postPhotoNetworkError,
  postPhotoInternalServerError,
  postPhotoSuccessThenFailure,
};

export { server };
