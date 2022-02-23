import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { formInputStyles, pickerSelectStyles } from "../../styles/FormInput";
import { getAtlasPickerItem, getAllAtlasPickerItems } from "../../record/Atlas";
import { isSample, isAtlas } from "../../record/Record";
import {
  AlgaeRecordTypePropType,
  AtlasTypePropType,
} from "../../record/PropTypes";
import TestIds from "../../constants/TestIds";

type AtlasSelectorProps = {
  recordType: AlgaeRecordType;
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

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Atlas Surface Data</Text>
      <RNPickerSelect
        touchableWrapperProps={{ testID: TestIds.Pickers.atlastSelectorTestId }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={
          isSample(recordType)
            ? [
                getAtlasPickerItem("Snow Algae"),
                getAtlasPickerItem("Mix of Algae and Dirt"),
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
  recordType: AlgaeRecordTypePropType.isRequired,
  atlasType: AtlasTypePropType.isRequired,
  setAtlasType: PropTypes.func.isRequired,
};
