import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { handlers, mockBackend } from "./handlers";

const mswServer = setupServer(...handlers);
const internalServerError = "500: Internal Server Error";
let postPhotoCount: number = 0;

const reset = () => {
  mswServer.resetHandlers();
  mockBackend.resetBackend();
  postPhotoCount = 0;
};

const postRecordNetworkError = (): string => {
  mswServer.use(
    http.post(
      mockBackend.recordsUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const postRecordInternalServerError = (): string => {
  mswServer.use(
    http.post(
      mockBackend.recordsUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const getRecordsNetworkError = (): string => {
  mswServer.use(
    http.get(
      mockBackend.recordsUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const getRecordsInternalServerError = (): string => {
  mswServer.use(
    http.get(
      mockBackend.recordsUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const postPhotoNetworkError = (): string => {
  mswServer.use(
    http.post(
      mockBackend.photosUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const postPhotoInternalServerError = (): string => {
  mswServer.use(
    http.post(
      mockBackend.photosUri,
      () => new HttpResponse(null, { status: 500 }),
    ),
  );

  return internalServerError;
};

const postPhotoSuccessThenFailure = (): string => {
  mswServer.use(
    http.post(mockBackend.photosUri, () => {
      postPhotoCount += 1;

      if (postPhotoCount > 1) {
        return new HttpResponse(null, { status: 500 });
      }

      return new HttpResponse(null, { status: 200 });
    }),
  );

  return internalServerError;
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
