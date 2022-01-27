import React, { forwardRef, useRef, useState } from "react";
import { Keyboard, Platform, Text, TextInput } from "react-native";
import PropTypes from "prop-types";
import { formInputStyles } from "../../styles/FormInput";

type CustomTextInputProps = {
  description: string;
  placeholder: string;
  maxLength?: number;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
};

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      description,
      placeholder,
      onChangeText,
      maxLength,
      onSubmitEditing,
    }: CustomTextInputProps,
    ref
  ) => {
    const textInputHeight = useRef(0);
    const [value, setValue] = useState("");

    // onContentSizeChange is called frequently for multiline TextInput, we only want to emit 'keyboardDidShow' event when height actually changes
    const handleMultilineTextInputOnContentSizeChange = (height, event) => {
      if (height !== 0 && height !== event.nativeEvent.contentSize.height) {
        // 'keyboardDidShow' expects the height of the keyboard (which we could capture in a new event listener in this component)
        // since we only have 1 'keyboardDidShow' listener we changed its logic to respond to this input
        // this is potentially bad if we set up additional 'keyboardDidShow' listeners in the app
        Keyboard.emit("keyboardDidShow", {});
      }

      return event.nativeEvent.contentSize.height;
    };

    return (
      <>
        <Text style={formInputStyles.optionStaticText}>{description}</Text>
        <TextInput
          // hack to get placeholder text to appear vertically centered on ios when TextInput is multiline
          style={[
            formInputStyles.optionInputText,
            Platform.OS === "ios" ? formInputStyles.multilineTextInput : {},
          ]}
          multiline
          blurOnSubmit
          ref={ref}
          value={value}
          placeholder={placeholder}
          onChangeText={(text) => {
            setValue(text);
            onChangeText(text);
          }}
          // @ts-expect-error (defaultProps assigns a value but default value in function signature results in unreachable code)
          onSubmitEditing={() => onSubmitEditing()}
          onContentSizeChange={(event) => {
            textInputHeight.current =
              handleMultilineTextInputOnContentSizeChange(
                textInputHeight.current,
                event
              );
          }}
          maxLength={maxLength}
          returnKeyType="done"
        />
      </>
    );
  }
);

CustomTextInput.propTypes = {
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func.isRequired,
  onSubmitEditing: PropTypes.func,
};

CustomTextInput.defaultProps = {
  maxLength: 255,
  onSubmitEditing: () => {},
};

// this is needed because of forwardRef
CustomTextInput.displayName = `CustomTextInput`;

export default CustomTextInput;
