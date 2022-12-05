import React, { forwardRef /* useRef */ } from "react";
import { FormControl, Input } from "native-base";
/* import {
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import RCTDeviceEventEmitter from "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter"; */

type CustomTextInputProps = {
  value?: string | undefined;
  label: string;
  placeholder: string;
  maxLength?: number;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
};

const CustomTextInput = forwardRef<typeof Input, CustomTextInputProps>(
  (
    {
      value,
      label,
      placeholder,
      onChangeText,
      maxLength = 255,
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

    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <Input
        size="lg"
        multiline
        blurOnSubmit
        // @ts-ignore ref typing isn't quite right in native-base yet
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        onSubmitEditing={() => onSubmitEditing()}
        /* onContentSizeChange={(event) => {
          textInputHeight.current =
            handleMultilineTextInputOnContentSizeChange(
              textInputHeight.current,
              event
            );
        }} */
        maxLength={maxLength}
        returnKeyType="done"
        variant="underlined"
      />
    </FormControl>
  )
);

export default CustomTextInput;

// this is needed because of forwardRef
CustomTextInput.displayName = `CustomTextInput`;
