import { http, HttpResponse } from "msw";

import { RecordsApiV2, AlgaeRecordResponseV2, DataResponseV2 } from "../src";

type MockBackend = {
  curRecordId: number;
  records: DataResponseV2[];
  recordsUri: string;
  photosUri: string;
  resetBackend: () => void;
};

const mockBackend: MockBackend = {
  curRecordId: 0,
  records: [],
  recordsUri: RecordsApiV2.baseUrl,
  // TODO: using v1 while we figured out v2 post photo looks like
  photosUri: `https://snowalgaeproductionapp.azurewebsites.net/api/v1.0/records/:recordId/photo`,

  resetBackend() {
    this.curRecordId = 0;
    this.records = [];
  },
};

const handlersV2 = [
  // Handles a POST /api/v2.0/records request
  http.post(RecordsApiV2.baseUrl, async ({ request }) => {
    const body = (await request.json()) as DataResponseV2;

    mockBackend.curRecordId += 1;
    body.id = `${mockBackend.curRecordId}`;
    mockBackend.records.push(body);
    return HttpResponse.json(body, { status: 200 });
  }),

  // Handles a GET /api/v2.0/records request
  http.get(RecordsApiV2.baseUrl, () => {
    const response: AlgaeRecordResponseV2 = {
      object: "list",
      data: mockBackend.records,
      meta: {
        result_count: mockBackend.records.length,
        next_token: "",
      },
    };

    if (mockBackend.records.length > 0) {
      return HttpResponse.json(response, { status: 200 });
    }

    return new HttpResponse(null, { status: 404 });
  }),

  // TODO: update comment when v2 post photo is determined
  // Handles a POST /api/v1.0/records/{recordId}/photo request
  http.post(
    mockBackend.photosUri,
    () => new HttpResponse(null, { status: 200 }),
  ),
];

export { handlersV2 as handlers, mockBackend };
