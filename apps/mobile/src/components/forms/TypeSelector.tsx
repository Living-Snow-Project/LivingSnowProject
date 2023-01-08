import React, { useState } from "react";
import {
  Box,
  Checkbox,
  CheckIcon,
  Flex,
  FormControl,
  HStack,
  Radio,
  Select,
  Text,
  useColorMode,
} from "native-base";
import { AlgaeColor, AlgaeRecordType, AlgaeSize } from "@livingsnow/record";
import {
  getAllAlgaeColorSelectorItems,
  getAllAlgaeSizeSelectorItems,
  getAllRecordTypeSelectorItems,
} from "../../record";
import { Labels, Placeholders, TestIds } from "../../constants";

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
        testID={TestIds.Selectors.RecordType}
      >
        <HStack>
          {getAllRecordTypeSelectorItems().map((item) => (
            <Box mr="3" key={item.value}>
              <Radio value={item.value}>{item.label}</Radio>
            </Box>
          ))}
        </HStack>
      </Radio.Group>
    </FormControl>
  );
}

type AlgaeSizeSelectorProps = {
  size: AlgaeSize;
  setSize: (type: AlgaeSize) => void;
};

function AlgaeSizeSelector({ size, setSize }: AlgaeSizeSelectorProps) {
  const renderSizes = () =>
    getAllAlgaeSizeSelectorItems().map((item) => (
      <Select.Item key={item.label} label={item.label} value={item.value} />
    ));

  return (
    <FormControl isRequired>
      <FormControl.Label>{Labels.RecordFields.Size}</FormControl.Label>
      <Select
        size="xl"
        selectedValue={size}
        placeholder={Placeholders.RecordScreen.Size}
        onValueChange={setSize}
        _selectedItem={{
          endIcon: <CheckIcon size="5" />,
        }}
      >
        {renderSizes()}
      </Select>
    </FormControl>
  );
}

type AlgaeColorSelectorProps = {
  colors: AlgaeColor[];
  onChangeColors: (colors: AlgaeColor[]) => void;
};

function AlgaeColorSelector({
  colors,
  onChangeColors,
}: AlgaeColorSelectorProps) {
  const { colorMode } = useColorMode();

  // TODO: remove when Checkbox.Group fixed
  // this is needed to get latest [un]selected colors in stale closures (because React doesn't re-render each color's Box if one changes)
  const [, setColorsInternal] = useState([...colors]);

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

      const isChecked = colors.includes(item.value);

      // TODO: replace when Checkbox.Group fixed
      const onChange = (isSelected: boolean) => {
        setColorsInternal((prev) => {
          const temp = [...prev];
          const selectIndex = temp.findIndex((cur) => cur == "Select colors");

          if (selectIndex != -1) {
            temp.splice(selectIndex, 1);
          }

          if (isSelected) {
            temp.push(item.value);
          } else {
            temp.splice(
              temp.findIndex((cur) => cur == item.value),
              1
            );
          }

          onChangeColors(temp);

          return [...temp];
        });
      };

      return (
        <Box mr="2" mt="1" key={item.value}>
          <Checkbox
            value={item.value}
            colorScheme={scheme}
            isChecked={isChecked}
            onChange={onChange}
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

export { AlgaeRecordTypeSelector, AlgaeSizeSelector, AlgaeColorSelector };
