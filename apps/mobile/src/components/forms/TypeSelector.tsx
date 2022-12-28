import React from "react";
import { Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Box, FormControl, HStack, Radio } from "native-base";
import { AlgaeColor, AlgaeRecordType, AlgaeSize } from "@livingsnow/record";
import { pickerSelectStyles, formInputStyles } from "../../styles/FormInput";
import {
  getAllAlgaeColorPickerItems,
  getAllAlgaeSizePickerItems,
  getAllRecordTypePickerItems,
} from "../../record";
import { Labels, TestIds } from "../../constants";

type TypeSelectorProps = {
  type: AlgaeRecordType;
  setType: (type: AlgaeRecordType) => void;
};

function TypeSelector({ type, setType }: TypeSelectorProps) {
  return (
    <FormControl>
      <FormControl.Label>{Labels.RecordForm.Type}</FormControl.Label>
      <Radio.Group
        name="type selector"
        accessibilityLabel="select type"
        defaultValue={type}
        onChange={setType}
      >
        <HStack mt="1">
          {getAllRecordTypePickerItems().map((item) => (
            <Box mr="3" key={item.value}>
              <Radio value={item.value}>{item.label}</Radio>
            </Box>
          ))}
        </HStack>
      </Radio.Group>
    </FormControl>
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
