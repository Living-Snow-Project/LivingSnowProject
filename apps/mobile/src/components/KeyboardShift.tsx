import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  EmitterSubscription,
  Keyboard,
  KeyboardEventListener,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
});

interface IProps {
  children: () => React.ReactNode;
}

interface IState {
  shift: Animated.Value;
}

const { State: TextInputState } = TextInput;

export class KeyboardShift extends Component<IProps, IState> {
  isHiding: Animated.CompositeAnimation | null;

  previousGap: number;

  keyboardDidShowSub: EmitterSubscription;

  keyboardDidHideSub: EmitterSubscription;

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

  handleKeyboardDidShow: KeyboardEventListener = (event) => {
    const { shift } = this.state;
    const { height: windowHeight } = Dimensions.get("window");
    // when the multiline TextInput grows, we want the keyboard to move with it
    const keyboardHeight = event.endCoordinates.height;
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
          let gap =
            windowHeight - keyboardHeight - (fieldTop + fieldHeight + 10);

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
    const { children } = this.props;
    const { shift } = this.state;

    return (
      <Animated.View
        style={[styles.container, { transform: [{ translateY: shift }] }]}
      >
        {children()}
      </Animated.View>
    );
  }
}
