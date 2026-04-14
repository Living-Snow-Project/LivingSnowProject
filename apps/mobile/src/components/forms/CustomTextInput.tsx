import React, { forwardRef } from "react";
import { TextInput } from "react-native";
import { Input } from "tamagui";
import { FormErrorMessage, FormField, FormLabel } from "./FormField";

type CustomTextInputProps = {
  label: string;
  placeholder: string;
  blurOnSubmit?: boolean;
  value?: string | undefined;
  validation?: string;
  maxLength?: number;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
};

export const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      label,
      placeholder,
      blurOnSubmit = false,
      value,
      validation,
      maxLength = 255,
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      onChangeText = () => {},
      onSubmitEditing = () => {},
    }: CustomTextInputProps,
    ref,
  ) => (
    <FormField id="" isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <Input
        size="$4"
        submitBehavior={blurOnSubmit ? "blurAndSubmit" : "submit"}
        ref={ref}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
        returnKeyType="done"
      />
      <FormErrorMessage>{validation}</FormErrorMessage>
    </FormField>
  ),
);

// this is needed because of forwardRef
CustomTextInput.displayName = `CustomTextInput`;
