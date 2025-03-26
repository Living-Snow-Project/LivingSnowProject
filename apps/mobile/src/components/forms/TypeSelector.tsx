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
  WarningOutlineIcon,
  useColorMode,
  VStack,
} from "native-base";
import { AlgaeColor, AlgaeRecordType, AlgaeSize, BloomDepthThicknessSelection, ExposedIceSelection, ImpuritiesSelection, OnOffGlacierSelection, SnowpackThicknessSelection, UnderSnowpackSelection } from "@livingsnow/record";
import {
  getAllAlgaeColorSelectorItems,
  getAllAlgaeSizeSelectorItems,
  getAllRecordTypeSelectorItems,
} from "../../record";
import { TextArea } from "../forms/TextArea";
import { BloomDepthDescription, ExposedIceDescription, ImpuritiesDescription, Labels, OnOffGlacierDescription, Placeholders, SnowpackThicknessDescription, TestIds, UnderSnowpackDescription, Validations } from "../../constants";
import { G } from "react-native-svg";

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
      <FormControl.Label>{Labels.RecordScreen.RecordType}</FormControl.Label>
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
  isInvalid: boolean;
  setSize: (type: AlgaeSize) => void;
};

function AlgaeSizeSelector({
  size,
  isInvalid,
  setSize,
}: AlgaeSizeSelectorProps) {
  const renderSizes = () =>
    getAllAlgaeSizeSelectorItems().map((item) => (
      <Select.Item key={item.label} label={item.label} value={item.value} />
    ));

  return (
    <FormControl isRequired isInvalid={isInvalid}>
      <FormControl.Label>{Labels.RecordScreen.Size}</FormControl.Label>
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
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="sm" />}>
        {Validations.invalidAlgaeSize}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

type AlgaeColorSelectorProps = {
  colors: AlgaeColor[];
  isInvalid: boolean;
  onChangeColors: (colors: AlgaeColor[]) => void;
};

function AlgaeColorSelector({
  colors,
  isInvalid,
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
              1,
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
    <FormControl isRequired isInvalid={isInvalid}>
      <FormControl.Label>{Labels.RecordScreen.Colors}</FormControl.Label>
      <Flex mt="-1" flexDirection="row" wrap="wrap">
        {renderColors()}
      </Flex>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="sm" />}>
        {Validations.invalidAlgaeColors}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

type GlacierOrNotSelectorProps = {
  onOrOffGlacier: OnOffGlacierSelection;
  setOnOrOffGlacier: (val: OnOffGlacierSelection) => void;
  exposedIce: ExposedIceSelection;
  setExposedIce: (val: ExposedIceSelection) => void;
  underSnow: UnderSnowpackSelection;
  setUnderSnow: (val: UnderSnowpackSelection) => void;
};

function GlacierOrNotSelector({
  onOrOffGlacier,
  setOnOrOffGlacier,
  exposedIce,
  setExposedIce,
  underSnow,
  setUnderSnow,
}: GlacierOrNotSelectorProps) {
  // Logic to show/hide second question
  const isOnGlacier = onOrOffGlacier === "Yes";
  const isOffGlacier = onOrOffGlacier === "No";

  return (
    <>
      {/* 1) Are you on glacier? */}
      <FormControl isRequired>
        <FormControl.Label>{Labels.RecordScreen.OnGlacier}</FormControl.Label>
        <Radio.Group
          name="onGlacier"
          accessibilityLabel="select if on glacier"
          value={onOrOffGlacier}
          onChange={(val) => setOnOrOffGlacier(val as OnOffGlacierSelection)}
        >
          <HStack>
            <Box mr="3">
              <Radio value={OnOffGlacierSelection.YES}>{OnOffGlacierDescription.Yes}</Radio>
            </Box>
            <Box>
              <Radio value={OnOffGlacierSelection.NO}>{OnOffGlacierDescription.No}</Radio>
            </Box>
          </HStack>
        </Radio.Group>
      </FormControl>

      {/* 2) If On => see exposed ice? */}
      {isOnGlacier && (
        <FormControl isRequired mt="3">
          <FormControl.Label>
            {Labels.RecordScreen.ExposedIce}
          </FormControl.Label>
          <Radio.Group
            name="exposedIce"
            accessibilityLabel="exposed ice question"
            defaultValue={exposedIce}
            onChange={setExposedIce}
          >
            <HStack>
              <Box mr="3">
                <Radio value={ExposedIceSelection.YES}>{ExposedIceDescription.Yes}</Radio>
              </Box>
              <Box>
                <Radio value={ExposedIceSelection.NO}>{ExposedIceDescription.No}</Radio>
              </Box>
            </HStack>
          </Radio.Group>
        </FormControl>
      )}

      {/* 2) If Off => what is under the snowpack? */}
      {isOffGlacier && (
        <FormControl isRequired mt="3">
          <FormControl.Label>
            {Labels.RecordScreen.UnderSnowpack}
          </FormControl.Label>
          <Select
            size="xl"
            placeholder={UnderSnowpackDescription.Select}
            selectedValue={underSnow}
            onValueChange={val => setUnderSnow(val as UnderSnowpackSelection)}
            _selectedItem={{ endIcon: <CheckIcon size="5" /> }}
          >
            <Select.Item label={UnderSnowpackDescription.Vegetation} value={UnderSnowpackSelection.VEGETATION} />
            <Select.Item label={UnderSnowpackDescription.Rocks} value={UnderSnowpackSelection.ROCKS} />
            <Select.Item label={UnderSnowpackDescription.Soil} value={UnderSnowpackSelection.SOIL} />
            <Select.Item label={UnderSnowpackDescription.Lake} value={UnderSnowpackSelection.LAKE} />
            <Select.Item label={UnderSnowpackDescription.Stream} value={UnderSnowpackSelection.STREAM} />
            <Select.Item label={UnderSnowpackDescription.Mixed} value={UnderSnowpackSelection.MIXED} />
            <Select.Item label={UnderSnowpackDescription.IdontKnow} value={UnderSnowpackSelection.I_DONT_KNOW} />
          </Select>
        </FormControl>
      )}
    </>
  );
}

export function getAllImpuritiesSelectorItems(): { value: ImpuritiesSelection; label: string }[] {
  return [
    {
      value: ImpuritiesSelection.ORANGE_DUST,
      label: ImpuritiesDescription.OrangeDust,
    },
    {
      value: ImpuritiesSelection.SOOT,
      label: ImpuritiesDescription.Soot,
    },
    {
      value: ImpuritiesSelection.SOIL,
      label: ImpuritiesDescription.Soil,
    },
    {
      value: ImpuritiesSelection.VEGETATION,
      label: ImpuritiesDescription.Vegetation,
    },
    {
      value: ImpuritiesSelection.POLLEN,
      label: ImpuritiesDescription.Pollen,
    },
    {
      value: ImpuritiesSelection.EVIDENCE_OF_ANIMALS,
      label: ImpuritiesDescription.EvidenceOfAnimals,
    },
    {
      value: ImpuritiesSelection.OTHER,
      label: ImpuritiesDescription.Other,
    },
  ];
}


type ImpuritiesSelectorProps = {
  /** Currently selected impurities. */
  impuritiesSelected: ImpuritiesSelection[];
  /** Callback when user toggles a checkbox. We return the updated array of selected values. */
  onChangeImpurities: (impuritiesSelected: ImpuritiesSelection[]) => void;
};

export function ImpuritiesSelector({
  impuritiesSelected,
  onChangeImpurities,
}: ImpuritiesSelectorProps) {
  const { colorMode } = useColorMode();

  // local state to force re-renders on each check/uncheck
  const [, setImpuritiesInternal] = useState<ImpuritiesSelection[]>([
    ...impuritiesSelected,
  ]);

  /** Renders each checkbox item. */
  const renderImpurities = () =>
    getAllImpuritiesSelectorItems().map((item) => {
      const isChecked = impuritiesSelected.includes(item.value);

      // On change of a single checkbox
      const onChange = (checked: boolean) => {
        setImpuritiesInternal((prev) => {
          const updated = [...prev];
          // optionally remove any placeholder if needed
          // e.g., const placeholderIndex = updated.indexOf("Select impurities");

          if (checked) {
            // add if not already
            if (!updated.includes(item.value)) {
              updated.push(item.value);
            }
          } else {
            // remove if present
            const idx = updated.indexOf(item.value);
            if (idx !== -1) {
              updated.splice(idx, 1);
            }
          }

          onChangeImpurities(updated);
          return updated;
        });
      };

      return (
        <Box key={item.value} mr="2" mt="1">
          <Checkbox
            value={item.value}
            isChecked={isChecked}
            onChange={onChange}
          >
            <Text fontWeight="normal">{item.label}</Text>
          </Checkbox>
        </Box>
      );
    });

  return (
    <FormControl isRequired >
      <FormControl.Label>Impurities (check all that apply)</FormControl.Label>
      <Flex mt="-1" flexDirection="row" wrap="wrap">
        {renderImpurities()}
      </Flex>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="sm" />}>
        {/* Replace with your own validation message if needed */}
        Please select at least one impurity if relevant.
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

type SnowpackThicknessSelectorProps = {
  thickness: SnowpackThicknessSelection;
  setThickness: (val: SnowpackThicknessSelection) => void;
};

function SnowpackThicknessSelector({
  thickness,
  setThickness,
}: SnowpackThicknessSelectorProps) {
  return (
    <FormControl isRequired mt="3">
      <FormControl.Label>{Labels.RecordScreen.SnowpackThickness}</FormControl.Label>
      <Radio.Group
        name="snowpackThickness"
        accessibilityLabel="select snowpack thickness"
        value={thickness}
        onChange={val => setThickness(val as SnowpackThicknessSelection)}
      >
        <VStack>
          <HStack>
            <Box mr="3" mt="1">
              <Radio value={SnowpackThicknessSelection.LESS_THAN_10_CM}>{SnowpackThicknessDescription.LessThan10Cm}</Radio>
            </Box>
            <Box mr="3" mt="1">
              <Radio value={SnowpackThicknessSelection.BETWEEN_10_CM_30_CM}>{SnowpackThicknessDescription.Between10Cm30Cm}</Radio>
            </Box>
          </HStack>
          <HStack>
            <Box mr="3" mt="1">
              <Radio value={SnowpackThicknessSelection.THIRTY_CM_TO_1_M}>{SnowpackThicknessDescription.ThirtyCm1M}</Radio>
            </Box>
            <Box mr="3" mt="1">
              <Radio value={SnowpackThicknessSelection.GREATER_THAN_1_M}>{SnowpackThicknessDescription.GreaterThan1M}</Radio>
            </Box>
          </HStack>
          <Box mr="3" mt="1">
            <Radio value={SnowpackThicknessSelection.I_DONT_KNOW}>{SnowpackThicknessDescription.IdontKnow}</Radio>
          </Box>
        </VStack>
      </Radio.Group>
    </FormControl>
  );
}

type BloomDepthSelectorProps = {
  bloomDepth: BloomDepthThicknessSelection;
  setBloomDepth: (val: BloomDepthThicknessSelection) => void;
  // otherDescription: string;
  // setOtherDescription: (val: string) => void;
};

function BloomDepthSelector({
  bloomDepth,
  setBloomDepth,
  // otherDescription: string;
  // setOtherDescription: (val: string) => void;
}: BloomDepthSelectorProps) {
  // if user picks "other", show a text input
  const handleBloomDepthChange = (val: string) => {
    setBloomDepth(val as BloomDepthThicknessSelection);
    // if (val !== "other") {
    //   setOtherDescription("");
    // }
  };

  return (
    <FormControl isRequired mt="3">
      <FormControl.Label>{Labels.RecordScreen.BloomDepth}</FormControl.Label>
      <Select
        size="xl"
        placeholder={BloomDepthDescription.Select}
        selectedValue={bloomDepth}
        onValueChange={handleBloomDepthChange}
        _selectedItem={{ endIcon: <CheckIcon size="5" /> }}
      >
        <Select.Item label={BloomDepthDescription.Surface} value={BloomDepthThicknessSelection.SURFACE} />
        <Select.Item label={BloomDepthDescription.TwoCm} value={BloomDepthThicknessSelection.TWO_CM} />
        <Select.Item label={BloomDepthDescription.FiveCm} value={BloomDepthThicknessSelection.FIVE_CM} />
        <Select.Item label={BloomDepthDescription.TenCm} value={BloomDepthThicknessSelection.TEN_CM} />
        <Select.Item label={BloomDepthDescription.GreaterThan10Cm} value={BloomDepthThicknessSelection.GREATER_THAN_TEN_CM} />
        <Select.Item label={BloomDepthDescription.Other} value={BloomDepthThicknessSelection.OTHER} />
      </Select>
      {/* 
      {bloomDepth === "other" && (
        <FormControl mt="3" isRequired>
          <FormControl.Label>Please describe:</FormControl.Label>
          <TextArea
            blurOnSubmit
            label="Other"
            placeholder="Describe approximate bloom depth"
            value={otherDescription}
            onChangeText={setOtherDescription}
          />
        </FormControl>
      )} */}
    </FormControl>
  );
}

export { AlgaeRecordTypeSelector, AlgaeSizeSelector, AlgaeColorSelector, GlacierOrNotSelector, SnowpackThicknessSelector, BloomDepthSelector };
