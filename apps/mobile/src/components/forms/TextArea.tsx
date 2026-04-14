import React, { forwardRef } from "react";
import { TextInput } from "react-native";
import { TextArea as TamaguiTextArea } from "tamagui";
import { FormField, FormLabel } from "./FormField";

type TextAreaProps = {
  id: string;
  label: string;
  placeholder: string;
  value?: string | undefined;
  maxLength?: number;
  blurOnSubmit?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
};

export const TextArea = forwardRef<TextInput, TextAreaProps>(
  (
    {
      id,
      label,
      placeholder,
      value,
      maxLength = 255,
      blurOnSubmit = false,
      onChangeText = () => {},
      onSubmitEditing,
    }: TextAreaProps,
    ref,
  ) => (
    <FormField id={id}>
      <FormLabel>{label}</FormLabel>
      <TamaguiTextArea
        ref={ref}
        submitBehavior={blurOnSubmit ? "blurAndSubmit" : "submit"}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => {
          if (text.length && text[text.length - 1] == "\n") {
            return;
          }

          onChangeText(text);
        }}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
        returnKeyType="done"
      />
    </FormField>
  ),
);

// this is needed because of forwardRef
TextArea.displayName = `TextArea`;
