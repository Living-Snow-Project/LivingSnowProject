import PropTypes from "prop-types";

const AlgaeRecordTypePropType: PropTypes.Requireable<AlgaeRecordType> =
  PropTypes.oneOf<AlgaeRecordType>([
    "Sample",
    "Sighting",
    "Atlas: Red Dot",
    "Atlas: Red Dot with Sample",
    "Atlas: Blue Dot",
    "Atlas: Blue Dot with Sample",
    "Undefined",
  ]);

const AtlasTypePropType: PropTypes.Requireable<AtlasType> =
  PropTypes.oneOf<AtlasType>([
    "Ash",
    "Dirt or Debris",
    "Forest or Vegetation",
    "Mix of Algae and Dirt",
    "Other",
    "Snow Algae",
    "White Snow",
    "Undefined",
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
  tubeId: PropTypes.string,
  locationDescription: PropTypes.string,
  notes: PropTypes.string,
  photoUris: PropTypes.string,
  atlasType: AtlasTypePropType,
});

export { AlgaeRecordPropType, AlgaeRecordTypePropType, AtlasTypePropType };
