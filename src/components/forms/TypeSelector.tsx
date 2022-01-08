import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles, formInputStyles } from "../../styles/FormInput";
import { RecordType, getAllRecordTypePickerItems } from "../../record/Record";

type TypeSelectorProps = {
  type: RecordType;
  setType: (type: RecordType) => void;
};

export default function TypeSelector({ type, setType }: TypeSelectorProps) {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        Are you Taking a Sample or Reporting a Sighting?
      </Text>
      <RNPickerSelect
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
  type: PropTypes.oneOf(Object.values(RecordType)).isRequired,
  setType: PropTypes.func.isRequired,
};
