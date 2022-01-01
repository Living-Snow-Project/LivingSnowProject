import { PropTypes } from "prop-types";
import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";

const { State: TextInputState } = TextInput;

export default class KeyboardShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: new Animated.Value(0),
    };
    this.previousGap = 0;
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowSub = Keyboard.addListener(
        "keyboardDidShow",
        this.handleKeyboardDidShow
      );
      this.keyboardDidHideSub = Keyboard.addListener(
        "keyboardDidHide",
        this.handleKeyboardDidHide
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "ios") {
      this.keyboardDidShowSub.remove();
      this.keyboardDidHideSub.remove();
    }
  }

  handleKeyboardDidShow = (event) => {
    const { shift } = this.state;
    const { height: windowHeight } = Dimensions.get("window");
    // when the multiline TextInput grows, we want the keyboard to move with it
    const keyboardHeight =
      event?.endCoordinates?.height === undefined
        ? this.keyboardHeight
        : event.endCoordinates.height;
    this.keyboardHeight = keyboardHeight;
    const currentlyFocusedInput = TextInputState.currentlyFocusedInput();

    if (this.isHiding) {
      this.isHiding.stop();
      this.isHiding = null;
    }

    if (currentlyFocusedInput != null) {
      currentlyFocusedInput.measure(
        (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          let gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);

          if (!gap) {
            return;
          }

          // negative gap means the currentlyFocusedInput is covered by Keyboard
          if (gap < 0) {
            gap += this.previousGap;
          }

          // positive gap means the currentlyFocusedInput is not covered by Keyboard
          if (gap >= 0) {
            return;
          }

          this.previousGap = gap;
          Animated.timing(shift, {
            toValue: gap,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      );
    }
  };

  handleKeyboardDidHide = () => {
    const { shift } = this.state;
    this.isHiding = Animated.timing(shift, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    });

    // it is common, and unpredictable, that 'keyboardDidHide' events are fired even though the keyboard remained visible
    // if this happens and 'keyboardDidShow' is simultaneously fired, we stop hiding animation from completing
    this.isHiding.start(({ finished }) => {
      this.isHiding = null;
      if (finished) {
        this.previousGap = 0;
      }
    });
  };

  render() {
    const { children: renderProp } = this.props;
    const { shift } = this.state;

    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY: shift }] }]}
      >
        {renderProp()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
});

KeyboardShift.propTypes = {
  children: PropTypes.func.isRequired,
};
