import PropTypes from "prop-types";
import { RecordType } from "./Record";
import { AtlasType } from "./Atlas";

const RecordPropType = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(Object.values(RecordType)).isRequired,
  name: PropTypes.string,
  organization: PropTypes.string,
  // TODO: JSON being converted to strings, and service storing most everything as string
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tubeId: PropTypes.string,
  locationDescription: PropTypes.string,
  notes: PropTypes.string,
  photoUris: PropTypes.string,
  atlasType: PropTypes.oneOf(Object.values(AtlasType)).isRequired,
};

export default RecordPropType;
