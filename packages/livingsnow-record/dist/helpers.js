import { AlgaeSize, BloomDepthThicknessSelection, ExposedIceSelection, OnOffGlacierSelection, SnowpackThicknessSelection, UnderSnowpackSelection } from "./types";
const randomInteger = () => Math.floor(Math.random() * 1000000);
export const makeExamplePhoto = ({ isLocal = false, uri = `${randomInteger()}`, width = randomInteger(), height = randomInteger(), } = {}) => ({
    uri: isLocal ? `file://${uri}` : uri,
    width,
    height,
});
export const isSample = (type) => Array("Sample").includes(type);
// consider randomizing more data; how that impacts snapshot testing and the above desired feature
export const makeExampleRecord = (type, id = "1234") => ({
    id,
    type,
    name: "test name",
    bloomDepth: BloomDepthThicknessSelection.OTHER,
    date: new Date("2021-09-16T00:00:00"),
    organization: "test org",
    latitude: -123.456,
    longitude: 96.96,
    size: AlgaeSize.FIST,
    colors: ["Red", "Green"],
    tubeId: isSample(type) ? "LAB-1337" : undefined,
    locationDescription: "test location",
    notes: "test notes",
    onOffGlacier: OnOffGlacierSelection.YES,
    snowpackThickness: SnowpackThicknessSelection.LESS_THAN_10_CM,
    underSnowpack: UnderSnowpackSelection.SELECT_AN_OPTION,
    exposedIce: ExposedIceSelection.YES
});
export function jsonToRecord(json) {
    const recordReviver = (key, value) => {
        if (key === "date") {
            return new Date(value);
        }
        return value;
    };
    return JSON.parse(json, recordReviver);
}
// want to display date in YYYY-MM-DD format
export function recordDateFormat(date) {
    const dayNum = date.getDate();
    let day = `${dayNum}`;
    if (dayNum < 10) {
        day = `0${dayNum}`;
    }
    const monthNum = date.getMonth() + 1;
    let month = `${monthNum}`;
    if (monthNum < 10) {
        month = `0${monthNum}`;
    }
    return `${date.getFullYear()}-${month}-${day}`;
}
