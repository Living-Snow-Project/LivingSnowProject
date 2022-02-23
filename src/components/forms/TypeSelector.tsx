import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles, formInputStyles } from "../../styles/FormInput";
import { getAllRecordTypePickerItems } from "../../record/Record";
import { AlgaeRecordTypePropType } from "../../record/PropTypes";
import TestIds from "../../constants/TestIds";

type TypeSelectorProps = {
  type: AlgaeRecordType;
  setType: (type: AlgaeRecordType) => void;
};

export default function TypeSelector({ type, setType }: TypeSelectorProps) {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        Are you Taking a Sample or Reporting a Sighting?
      </Text>
      <RNPickerSelect
        touchableWrapperProps={{ testID: TestIds.Pickers.recordSelectorTestId }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={getAllRecordTypePickerItems()}
        onValueChange={(value) => setType(value)}
        value={type}
      />
    </>
  );
}

TypeSelector.propTypes = {
  type: AlgaeRecordTypePropType.isRequired,
  setType: PropTypes.func.isRequired,
};
