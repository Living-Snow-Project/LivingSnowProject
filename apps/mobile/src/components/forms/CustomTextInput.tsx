import React, { forwardRef /* useRef */ } from "react";
import { FormControl, Input, WarningOutlineIcon } from "native-base";
/* import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import RCTDeviceEventEmitter from "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter"; */

type CustomTextInputProps = {
  label: string;
  placeholder: string;
  value?: string | undefined;
  validation?: string;
  maxLength?: number;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
};

export const CustomTextInput = forwardRef<typeof Input, CustomTextInputProps>(
  (
    {
      label,
      placeholder,
      value,
      validation,
      maxLength = 255,
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      onChangeText = () => {},
      onSubmitEditing = () => {},
    }: CustomTextInputProps,
    ref
  ) => (
    /* const textInputHeight = useRef(0);

    // onContentSizeChange is called frequently for multiline TextInput, we only want to emit 'keyboardDidShow' event when height actually changes
    const handleMultilineTextInputOnContentSizeChange = (
      height: number,
      event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
    ) => {
      if (height !== 0 && height !== event.nativeEvent.contentSize.height) {
        // 'keyboardDidShow' expects the height of the keyboard (which we could capture in a new event listener in this component)
        // since we only have 1 'keyboardDidShow' listener we changed its logic to respond to this input
        // this is potentially bad if we set up additional 'keyboardDidShow' listeners in the app
        RCTDeviceEventEmitter.emit("keyboardDidShow", {});
      }

      return event.nativeEvent.contentSize.height;
    }; */

    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        size="lg"
        multiline
        blurOnSubmit
        // @ts-ignore ref typing isn't quite right in native-base yet
        ref={ref}
        value={value}
        placeholder={placeholder}
        isDisabled={isDisabled}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        /* onContentSizeChange={(event) => {
          textInputHeight.current =
            handleMultilineTextInputOnContentSizeChange(
              textInputHeight.current,
              event
            );
        }} */
        maxLength={maxLength}
        returnKeyType="done"
        variant="outline"
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="sm" />}>
        {validation}
      </FormControl.ErrorMessage>
    </FormControl>
  )
);

// this is needed because of forwardRef
CustomTextInput.displayName = `CustomTextInput`;
