import PropTypes from "prop-types";
import { AtlasType } from "./Atlas";

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

// TODO: const AlgaeRecordPropType: PropTypes.Requireable<AlgaeRecord>...
// backend types will need to change first (ie. lat, long are strings in db model)
const AlgaeRecordPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
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
  atlasType: PropTypes.oneOf(Object.values(AtlasType)).isRequired,
});

export { AlgaeRecordPropType, AlgaeRecordTypePropType };
