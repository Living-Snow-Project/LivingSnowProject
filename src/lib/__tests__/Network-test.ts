import server from "../../mocks/server";
import "isomorphic-fetch";
import { downloadRecords, uploadRecord } from "../Network";
import { makeExampleRecord } from "../../record/Record";

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

describe("Network test suite", () => {
  test("upload record succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    // TODO: any!
    const received = await uploadRecord(expected as any);

    expect(received.id).not.toEqual(expected.id);
    expect(received.type).toEqual(expected.type);
  });

  test("download records succeeds", async () => {
    const expected = makeExampleRecord("Sample");
    // TODO: any!
    const received = await uploadRecord(expected as any);

    expect(received.id).not.toEqual(expected.id);
    expect(received.type).toEqual(expected.type);

    const download = await downloadRecords();

    // TODO: not great... [1]
    expect(download[1]).toEqual(received);
  });
});
