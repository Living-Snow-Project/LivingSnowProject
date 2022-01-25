import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { formInputStyles, pickerSelectStyles } from "../../styles/FormInput";
import {
  AtlasType,
  getAtlasPickerItem,
  getAllAtlasPickerItems,
} from "../../record/Atlas";
import { RecordType, isSample, isAtlas } from "../../record/Record";

type AtlasSelectorProps = {
  recordType: RecordType;
  atlasType: AtlasType;
  setAtlasType: (type: AtlasType) => void;
};

export default function AtlasSelector({
  recordType,
  atlasType,
  setAtlasType,
}: AtlasSelectorProps) {
  if (!isAtlas(recordType)) {
    return null;
  }

  const localAtlasType =
    atlasType === AtlasType.Undefined ? AtlasType.SnowAlgae : atlasType;

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Atlas Surface Data</Text>
      <RNPickerSelect
        touchableWrapperProps={{ testID: "atlas-type-picker" }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={
          isSample(recordType)
            ? [
                getAtlasPickerItem(AtlasType.SnowAlgae),
                getAtlasPickerItem(AtlasType.MixOfAlgaeAndDirt),
              ]
            : getAllAtlasPickerItems()
        }
        onValueChange={(type) => setAtlasType(type)}
        value={localAtlasType}
      />
    </>
  );
}

AtlasSelector.propTypes = {
  recordType: PropTypes.oneOf(Object.values(RecordType)).isRequired,
  atlasType: PropTypes.oneOf(Object.values(AtlasType)).isRequired,
  setAtlasType: PropTypes.func.isRequired,
};
