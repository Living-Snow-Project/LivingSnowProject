import PropTypes from "prop-types";

const AlgaeRecordTypePropType: PropTypes.Requireable<AlgaeRecordType> =
  PropTypes.oneOf<AlgaeRecordType>(["Sample", "Sighting", "Undefined"]);

const AlgaeSizePropType: PropTypes.Requireable<AlgaeSize> =
  PropTypes.oneOf<AlgaeSize>([
    "Select a size",
    "Fist",
    "Shoe Box",
    "Coffee Table",
    "Car",
    "Bus",
    "Playground",
    "Sports Field",
    "Other",
  ]);

const AlgaeColorPropType: PropTypes.Requireable<AlgaeColor> =
  PropTypes.oneOf<AlgaeColor>([
    "Select a color",
    "Red",
    "Pink",
    "Grey",
    "Green",
    "Orange",
    "Yellow",
    "Other",
  ]);

// TODO: const AlgaeRecordPropType: PropTypes.Requireable<AlgaeRecord>...
// backend types will need to change first (ie. lat, long are strings in db model)
const AlgaeRecordPropType = PropTypes.shape({
  // TODO: pendingRecords uses uuidv4() to generate an id...
  id: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
  type: AlgaeRecordTypePropType.isRequired,
  name: PropTypes.string,
  organization: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: AlgaeSizePropType,
  color: AlgaeColorPropType,
  tubeId: PropTypes.string,
  locationDescription: PropTypes.string,
  notes: PropTypes.string,
  photoUris: PropTypes.string,
});

export {
  AlgaeRecordPropType,
  AlgaeRecordTypePropType,
  AlgaeSizePropType,
  AlgaeColorPropType,
};
