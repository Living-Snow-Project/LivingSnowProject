import React, { useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, View, Text, useTheme } from "tamagui";
import { TamaguiPickerSelect } from "./PickerSelect";
import { AlgaeColor, AlgaeRecordType, AlgaeSize } from "@livingsnow/record";
import {
  getAllAlgaeColorSelectorItems,
  getAllAlgaeSizeSelectorItems,
  getAllRecordTypeSelectorItems,
  getAllSurfaceImpuritySelectorItems,
} from "../../record";
import {
  BloomDepthDescription,
  ExposedIceDescription,
  Labels,
  OnOffGlacierDescription,
  Placeholders,
  SnowpackThicknessDescription,
  TestIds,
  UnderSnowpackDescription,
  Validations,
} from "../../constants";
import {
  BloomDepth,
  SeeExposedIce,
  SnowpackDepth,
  SurfaceImpurity,
  WhatIsUnderSnowpack,
} from "@livingsnow/record/src/types";
import { FormField, FormLabel, FormErrorMessage } from "./FormField";

type AlgaeRecordTypeSelectorProps = {
  type: AlgaeRecordType;
  setType: (type: AlgaeRecordType) => void;
};

function AlgaeRecordTypeSelector({
  type,
  setType,
}: AlgaeRecordTypeSelectorProps) {
  return (
    <FormField id="algae-record-type" isRequired>
      <FormLabel>{Labels.RecordScreen.RecordType}</FormLabel>
      <XStack testID={TestIds.Selectors.RecordType}>
        {getAllRecordTypeSelectorItems().map((item) => (
          <RadioOption
            key={item.value}
            label={item.label}
            value={item.value}
            selectedValue={type}
            onSelect={setType}
          />
        ))}
      </XStack>
    </FormField>
  );
}

type RadioOptionProps<T> = {
  label: string;
  value: T;
  selectedValue: string;
  onSelect: (value: T) => void;
};

function RadioOption<T>({
  label,
  value,
  selectedValue,
  onSelect,
}: RadioOptionProps<T>) {
  const isSelected = selectedValue === value;
  return (
    <Pressable onPress={() => onSelect(value)}>
      <XStack gap="$2" alignItems="center" marginRight="$3">
        <View
          width={20}
          height={20}
          borderRadius={10}
          borderWidth={2}
          borderColor="$blue10"
          alignItems="center"
          justifyContent="center"
        >
          {isSelected && (
            <View
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor="$blue10"
            />
          )}
        </View>
        <Text>{label}</Text>
      </XStack>
    </Pressable>
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
  return (
    <FormField id="algae-size" isRequired isInvalid={isInvalid}>
      <FormLabel>{Labels.RecordScreen.Size}</FormLabel>
      <TamaguiPickerSelect
        placeholder={Placeholders.RecordScreen.Size}
        items={getAllAlgaeSizeSelectorItems()}
        onValueChange={(val) => setSize(val as AlgaeSize)}
        value={size}
      />
      <FormErrorMessage>{Validations.invalidAlgaeSize}</FormErrorMessage>
    </FormField>
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
  const theme = useTheme();

  const renderColors = () =>
    getAllAlgaeColorSelectorItems().map((item) => {
      const color = theme.dark ? item.color?.dark : item.color?.light;

      const isChecked = colors.includes(item.value);

      const onChange = (isSelected: boolean) => {
        const temp = colors.filter(
          (c) => c !== "Select colors",
        ) as AlgaeColor[];
        if (isSelected) {
          temp.push(item.value);
        } else {
          const idx = temp.findIndex((c) => c === item.value);
          if (idx !== -1) temp.splice(idx, 1);
        }
        onChangeColors(temp);
      };

      return (
        <Pressable key={item.value} onPress={() => onChange(!isChecked)}>
          <XStack gap="$2" alignItems="center" marginRight="$2" marginTop="$1">
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? theme.blue10.val : theme.color.val}
            />
            <Text color={color as any} fontWeight={color ? "500" : "400"}>
              {item.label}
            </Text>
          </XStack>
        </Pressable>
      );
    });

  return (
    <FormField id="algae-colors" isRequired isInvalid={isInvalid}>
      <FormLabel>{Labels.RecordScreen.Colors}</FormLabel>
      <XStack marginTop="$-1" flexWrap="wrap">
        {renderColors()}
      </XStack>
      <FormErrorMessage>{Validations.invalidAlgaeColors}</FormErrorMessage>
    </FormField>
  );
}

type GlacierOrNotSelectorProps = {
  isOnGlacier?: boolean;
  setIsOnGlacier: (val: boolean) => void;
  exposedIce?: SeeExposedIce | WhatIsUnderSnowpack;
  setExposedIce: (val: SeeExposedIce) => void;
  underSnow?: SeeExposedIce | WhatIsUnderSnowpack;
  setUnderSnow: (val: WhatIsUnderSnowpack) => void;
};

function GlacierOrNotSelector({
  isOnGlacier,
  setIsOnGlacier,
  exposedIce,
  setExposedIce,
  underSnow,
  setUnderSnow,
}: GlacierOrNotSelectorProps) {
  const glacierValue =
    isOnGlacier === true ? "Yes" : isOnGlacier === false ? "No" : "";

  return (
    <>
      {/* 1) Are you on glacier? */}
      <FormField id="on-glacier">
        <FormLabel>{Labels.RecordScreen.OnGlacier}</FormLabel>
        <XStack>
          {(["Yes", "No"] as const).map((val) => (
            <RadioOption
              key={val}
              label={
                val === "Yes"
                  ? OnOffGlacierDescription.Yes
                  : OnOffGlacierDescription.No
              }
              value={val}
              selectedValue={glacierValue}
              onSelect={(v) => setIsOnGlacier(v === "Yes")}
            />
          ))}
        </XStack>
      </FormField>

      {/* 2) If On => see exposed ice? */}
      {isOnGlacier && (
        <View marginTop="$3">
          <FormField id="exposed-ice">
            <FormLabel>{Labels.RecordScreen.ExposedIce}</FormLabel>
            <XStack>
              {(
                [ExposedIceDescription.Yes, ExposedIceDescription.No] as const
              ).map((val) => (
                <RadioOption
                  key={val}
                  label={val}
                  value={val}
                  selectedValue={exposedIce ?? ""}
                  onSelect={(v) => setExposedIce(v as SeeExposedIce)}
                />
              ))}
            </XStack>
          </FormField>
        </View>
      )}

      {/* 3) If Off => what is under the snowpack? */}
      {isOnGlacier != undefined && !isOnGlacier && (
        <View marginTop="$3">
          <FormField id="under-snowpack">
            <FormLabel>{Labels.RecordScreen.UnderSnowpack}</FormLabel>
            <TamaguiPickerSelect
              placeholder={UnderSnowpackDescription.Select}
              items={[
                {
                  label: UnderSnowpackDescription.Vegetation,
                  value: "Vegetation",
                },
                { label: UnderSnowpackDescription.Rocks, value: "Rocks" },
                { label: UnderSnowpackDescription.Soil, value: "Soil" },
                {
                  label: UnderSnowpackDescription.PondOrTarn,
                  value: "Pond or Tarn",
                },
                { label: UnderSnowpackDescription.Lake, value: "Lake" },
                { label: UnderSnowpackDescription.Stream, value: "Stream" },
                { label: UnderSnowpackDescription.Mixed, value: "Mixed" },
                {
                  label: UnderSnowpackDescription.IdontKnow,
                  value: "I Don't Know",
                },
              ]}
              onValueChange={(val) => setUnderSnow(val as WhatIsUnderSnowpack)}
              value={underSnow}
            />
          </FormField>
        </View>
      )}
    </>
  );
}

type ImpuritiesSelectorProps = {
  impuritiesSelected: SurfaceImpurity[];
  onChangeImpurities: (impuritiesSelected: SurfaceImpurity[]) => void;
};

export function ImpuritiesSelector({
  impuritiesSelected,
  onChangeImpurities,
}: ImpuritiesSelectorProps) {
  const theme = useTheme();

  const renderImpurities = () =>
    getAllSurfaceImpuritySelectorItems().map((item) => {
      const isChecked = impuritiesSelected.includes(item.value);

      const onChange = (checked: boolean) => {
        const updated = [...impuritiesSelected];
        if (checked) {
          if (!updated.includes(item.value)) updated.push(item.value);
        } else {
          const idx = updated.indexOf(item.value);
          if (idx !== -1) updated.splice(idx, 1);
        }
        onChangeImpurities(updated);
      };

      return (
        <Pressable key={item.value} onPress={() => onChange(!isChecked)}>
          <XStack gap="$2" alignItems="center" marginRight="$2" marginTop="$1">
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? theme.blue10.val : theme.color.val}
            />
            <Text fontWeight="400">{item.label}</Text>
          </XStack>
        </Pressable>
      );
    });

  return (
    <FormField id="impurities">
      <FormLabel>{Labels.RecordScreen.ImpuritiesSelectAllThatApply}</FormLabel>
      <XStack marginTop="$-1" flexWrap="wrap">
        {renderImpurities()}
      </XStack>
    </FormField>
  );
}

type SnowpackThicknessSelectorProps = {
  thickness: SnowpackDepth;
  setThickness: (val: SnowpackDepth) => void;
};

function SnowpackThicknessSelector({
  thickness,
  setThickness,
}: SnowpackThicknessSelectorProps) {
  const [localThickness, setLocalThickness] = useState(thickness);

  const handleSelect = (val: string) => {
    const newVal = val as SnowpackDepth;
    setLocalThickness(newVal);
    setThickness(newVal);
  };

  return (
    <View marginTop="$3">
      <FormField id="snowpack-thickness">
        <FormLabel>{Labels.RecordScreen.SnowpackThickness}</FormLabel>
        <YStack>
          <XStack>
            <RadioOption
              label={SnowpackThicknessDescription.LessThan10Cm}
              value="< 10cm"
              selectedValue={localThickness}
              onSelect={handleSelect}
            />
            <RadioOption
              label={SnowpackThicknessDescription.Between10Cm30Cm}
              value="10cm - 30cm"
              selectedValue={localThickness}
              onSelect={handleSelect}
            />
          </XStack>
          <XStack>
            <RadioOption
              label={SnowpackThicknessDescription.ThirtyCm1M}
              value="30cm - 1m"
              selectedValue={localThickness}
              onSelect={handleSelect}
            />
            <RadioOption
              label={SnowpackThicknessDescription.GreaterThan1M}
              value="> 1m"
              selectedValue={localThickness}
              onSelect={handleSelect}
            />
          </XStack>
          <RadioOption
            label={SnowpackThicknessDescription.Other}
            value="Other"
            selectedValue={localThickness}
            onSelect={handleSelect}
          />
        </YStack>
      </FormField>
    </View>
  );
}

type BloomDepthSelectorProps = {
  bloomDepth: BloomDepth;
  setBloomDepth: (val: BloomDepth) => void;
};

function BloomDepthSelector({
  bloomDepth,
  setBloomDepth,
}: BloomDepthSelectorProps) {
  const handleBloomDepthChange = (val: string) => {
    setBloomDepth(val as BloomDepth);
  };

  return (
    <View marginTop="$3">
      <FormField id="bloom-depth">
        <FormLabel>{Labels.RecordScreen.BloomDepth}</FormLabel>
        <TamaguiPickerSelect
          placeholder={BloomDepthDescription.Select}
          items={[
            { label: BloomDepthDescription.Surface, value: "Surface" },
            { label: BloomDepthDescription.TwoCm, value: "2cm" },
            { label: BloomDepthDescription.FiveCm, value: "5cm" },
            { label: BloomDepthDescription.TenCm, value: "10cm" },
            { label: BloomDepthDescription.GreaterThan10Cm, value: "> 10cm" },
            { label: BloomDepthDescription.Other, value: "Other" },
          ]}
          onValueChange={handleBloomDepthChange}
          value={bloomDepth}
        />
      </FormField>
    </View>
  );
}

export {
  AlgaeRecordTypeSelector,
  AlgaeSizeSelector,
  AlgaeColorSelector,
  GlacierOrNotSelector,
  SnowpackThicknessSelector,
  BloomDepthSelector,
};
