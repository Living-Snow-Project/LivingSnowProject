import { AlgaeRecord, AlgaeRecordType, Photo } from "./types";

const randomInteger = (): number => Math.floor(Math.random() * 1000000);

export const makeExamplePhoto = ({
  isLocal = false,
  uri = `${randomInteger()}`,
  width = randomInteger(),
  height = randomInteger(),
} = {}): Photo => ({
  uri: isLocal ? `file://${uri}` : uri,
  width,
  height,
});

export const isSample = (type: AlgaeRecordType) =>
  Array<AlgaeRecordType>("Sample").includes(type);

// consider randomizing more data; how that impacts snapshot testing and the above desired feature
export const makeExampleRecord = (
  type: AlgaeRecordType,
  id: string = "1234"
): AlgaeRecord => ({
  id,
  type,
  name: "test name",
  date: new Date("2021-09-16T00:00:00"),
  organization: "test org",
  latitude: -123.456,
  longitude: 96.96,
  size: "Fist",
  colors: ["Red", "Green"],
  tubeId: isSample(type) ? "LAB-1337" : undefined,
  locationDescription: "test location",
  notes: "test notes",
});

export function jsonToRecord<T>(json: string): T {
  const recordReviver = (key: string, value: any): any => {
    if (key === "date") {
      return new Date(value);
    }

    return value;
  };

  return JSON.parse(json, recordReviver);
}

// want to display date in YYYY-MM-DD format
export function recordDateFormat(date: Date): string {
  const dayNum: number = date.getDate();
  let day: string = `${dayNum}`;

  if (dayNum < 10) {
    day = `0${dayNum}`;
  }

  const monthNum: number = date.getMonth() + 1;
  let month: string = `${monthNum}`;

  if (monthNum < 10) {
    month = `0${monthNum}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
}
