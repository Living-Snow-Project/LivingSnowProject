import React, { forwardRef } from "react";
import { FormControl, TextArea as NBTextArea } from "native-base";

type TextAreaProps = {
  label: string;
  placeholder: string;
  value?: string | undefined;
  maxLength?: number;
  blurOnSubmit?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
};

export const TextArea = forwardRef<typeof NBTextArea, TextAreaProps>(
  (
    {
      label,
      placeholder,
      value,
      maxLength = 255,
      blurOnSubmit = false,
      onChangeText = () => {},
      onSubmitEditing,
    }: TextAreaProps,
    ref
  ) => (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      {/* @ts-ignore missing typing for autoCompleteType */}
      <NBTextArea
        size="lg"
        blurOnSubmit={blurOnSubmit}
        // @ts-ignore ref typing isn't quite right in native-base yet
        ref={ref}
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
        variant="outline"
      />
    </FormControl>
  )
);

// this is needed because of forwardRef
TextArea.displayName = `TextArea`;
