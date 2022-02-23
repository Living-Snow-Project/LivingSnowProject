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
import { isSample, isAtlas } from "../../record/Record";
import { AlgaeRecordTypePropType } from "../../record/RecordPropTypes";
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
  recordType: AlgaeRecordTypePropType.isRequired,
  atlasType: PropTypes.oneOf(Object.values(AtlasType)).isRequired,
  setAtlasType: PropTypes.func.isRequired,
};
