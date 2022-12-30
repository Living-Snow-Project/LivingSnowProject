import React from "react";
import RNPickerSelect from "react-native-picker-select";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  HStack,
  Radio,
  Text,
  useColorMode,
} from "native-base";
import { AlgaeRecordType, AlgaeSize } from "@livingsnow/record";
import { pickerSelectStyles, formInputStyles } from "../../styles/FormInput";
import {
  getAllAlgaeColorSelectorItems,
  getAllAlgaeSizePickerItems,
  getAllRecordTypePickerItems,
} from "../../record";
import { Labels, TestIds } from "../../constants";

type AlgaeRecordTypeSelectorProps = {
  type: AlgaeRecordType;
  setType: (type: AlgaeRecordType) => void;
};

function AlgaeRecordTypeSelector({
  type,
  setType,
}: AlgaeRecordTypeSelectorProps) {
  return (
    <FormControl isRequired>
      <FormControl.Label>{Labels.RecordForm.Type}</FormControl.Label>
      <Radio.Group
        name="algae record type selector"
        accessibilityLabel="select type of record"
        defaultValue={type}
        onChange={setType}
      >
        <HStack>
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

// TODO: change type for V2 API
/* type AlgaeColorSelectorProps = {
  colors: AlgaeColor;
  setColors: (type: AlgaeColor) => void;
}; */

function AlgaeColorSelector(/* { colors, setColors }: AlgaeColorSelectorProps */) {
  const { colorMode } = useColorMode();

  const renderColors = () =>
    getAllAlgaeColorSelectorItems().map((item) => {
      let color: string | undefined;
      let scheme = "info";

      if (item.color) {
        if (colorMode == "light") {
          color = item.color.light;
          [scheme] = color.split(".");
        } else {
          color = item.color.dark;
          [scheme] = color.split(".");
        }
      }

      return (
        <Box mr="2" mt="1" key={item.value}>
          <Checkbox
            value={item.value}
            colorScheme={scheme}
            // onChange={(value: boolean) => goofy logic goes here because Checkbox.Group logs a warning during onChange)}
          >
            <Text color={color} fontWeight={color ? "medium" : "normal"}>
              {item.label}
            </Text>
          </Checkbox>
        </Box>
      );
    });

  return (
    <FormControl isRequired>
      <FormControl.Label>{Labels.RecordForm.Color}</FormControl.Label>
      <Flex mt="-1" flexDirection="row" wrap="wrap">
        {renderColors()}
      </Flex>
    </FormControl>
  );
}

export { AlgaeRecordTypeSelector, AlgaeSizePicker, AlgaeColorSelector };
