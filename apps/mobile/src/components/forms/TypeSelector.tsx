import React from "react";
import { Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { AlgaeColor, AlgaeRecordType, AlgaeSize } from "@livingsnow/record";
import { pickerSelectStyles, formInputStyles } from "../../styles/FormInput";
import { getAllRecordTypePickerItems } from "../../record/Record";
import { getAllAlgaeSizePickerItems } from "../../record/Size";
import { getAllAlgaeColorPickerItems } from "../../record/Color";
import { TestIds } from "../../constants/TestIds";
import { Labels } from "../../constants/Strings";

type TypeSelectorProps = {
  type: AlgaeRecordType;
  setType: (type: AlgaeRecordType) => void;
};

function TypeSelector({ type, setType }: TypeSelectorProps) {
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

type AlgaeSizePickerProps = {
  size: AlgaeSize;
  setSize: (type: AlgaeSize) => void;
};

function AlgaeSizePicker({ size, setSize }: AlgaeSizePickerProps) {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        {Labels.RecordFields.Size}
      </Text>
      <RNPickerSelect
        touchableWrapperProps={{
          testID: TestIds.Pickers.algaeSizePickerTestId,
        }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={getAllAlgaeSizePickerItems()}
        onValueChange={(value) => setSize(value)}
        value={size}
      />
    </>
  );
}

type AlgaeColorPickerProps = {
  color: AlgaeColor;
  setColor: (type: AlgaeColor) => void;
};

function AlgaeColorPicker({ color, setColor }: AlgaeColorPickerProps) {
  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        {Labels.RecordFields.Color}
      </Text>
      <RNPickerSelect
        touchableWrapperProps={{
          testID: TestIds.Pickers.algaeColorPickerTestId,
        }}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        items={getAllAlgaeColorPickerItems()}
        onValueChange={(value) => setColor(value)}
        value={color}
      />
    </>
  );
}

export { TypeSelector, AlgaeSizePicker, AlgaeColorPicker };
