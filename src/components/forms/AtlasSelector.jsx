import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { formInputStyles, pickerSelectStyles } from "../../styles/FormInput";
import { AtlasTypes, AtlasTypesTable, getAtlasItem } from "../../lib/Atlas";

export default function AtlasSelector({ recordType, atlasType, setAtlasType }) {
  if (!recordType.includes(`Atlas`)) {
    return null;
  }

  const localAtlasType =
    atlasType === AtlasTypes.Undefined ? AtlasTypes.SnowAlgae : atlasType;

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Atlas Surface Data</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={
          recordType.includes(`Sample`)
            ? [
                getAtlasItem(AtlasTypes.SnowAlgae),
                getAtlasItem(AtlasTypes.MixOfAlgaeAndDirt),
              ]
            : AtlasTypesTable
        }
        onValueChange={(type) => setAtlasType(type)}
        value={localAtlasType}
      />
    </>
  );
}

AtlasSelector.propTypes = {
  recordType: PropTypes.string.isRequired,
  atlasType: PropTypes.number.isRequired,
  setAtlasType: PropTypes.func.isRequired,
};
