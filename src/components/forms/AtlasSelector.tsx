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
import * as Record from "../../record/Record";

type AtlasSelectorProps = {
  recordType: Record.RecordType;
  atlasType: AtlasType;
  setAtlasType: (type: AtlasType) => void;
};

export default function AtlasSelector({
  recordType,
  atlasType,
  setAtlasType,
}: AtlasSelectorProps) {
  if (!Record.isAtlas(recordType)) {
    return null;
  }

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Atlas Surface Data</Text>
      <RNPickerSelect
        touchableWrapperProps={{ testID: "atlas-type-picker" }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={
          Record.isSample(recordType)
            ? [
                getAtlasPickerItem(AtlasType.SnowAlgae),
                getAtlasPickerItem(AtlasType.MixOfAlgaeAndDirt),
              ]
            : getAllAtlasPickerItems()
        }
        onValueChange={(type) => setAtlasType(type)}
        value={atlasType}
      />
    </>
  );
}

AtlasSelector.propTypes = {
  recordType: PropTypes.oneOf(Object.values(Record.RecordType)).isRequired,
  atlasType: PropTypes.oneOf(Object.values(AtlasType)).isRequired,
  setAtlasType: PropTypes.func.isRequired,
};
