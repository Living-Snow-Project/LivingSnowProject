import React, { forwardRef, useRef } from 'react';
import { Keyboard, Platform, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { formInputStyles } from '../../styles/FormInput';

export const CustomTextInput = forwardRef(({description, placeholder, maxLength = 255, onChangeText, onSubmitEditing = () => {}}, ref) => {
  let height = useRef(0);

    // onContentSizeChange is called frequently for multiline TextInput, we only want to emit 'keyboardDidShow' event when height actually changes
  const handleMultilineTextInputOnContentSizeChange = (height, event) => {
    if (height != 0 && height != event.nativeEvent.contentSize.height) {
      // 'keyboardDidShow' expects the height of the keyboard (which we could capture in a new event listener in this component)
      // since we only have 1 'keyboardDidShow' listener we changed its logic to respond to this input
      // this is potentially bad if we set up additional 'keyboardDidShow' listeners in the app
      Keyboard.emit('keyboardDidShow', {});
    }
    
    return event.nativeEvent.contentSize.height;
  }

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>
        {description}
      </Text>
      <TextInput
        // this is kind of a hack to get placeholder text to appear vertically centered on ios when TextInput is multiline
        style={[formInputStyles.optionInputText, Platform.OS === 'ios' ? formInputStyles.multilineTextInput : {}]}
        multiline
        blurOnSubmit
        ref={ref}
        placeholder={placeholder}
        onChangeText={text => onChangeText(text)}
        onSubmitEditing={() => onSubmitEditing()}
        onContentSizeChange={event => height.current = handleMultilineTextInputOnContentSizeChange(height.current, event)}
        maxLength={maxLength}
        returnKeyType="done"
      />
    </>
  );
})

CustomTextInput.propTypes = {
  description: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func
}

CustomTextInput.displayName = `CustomTextInput`;