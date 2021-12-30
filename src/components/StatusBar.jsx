import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

// here's the idea (and likely this is too much functionality for a single component)
// status types:
//  permanent\static: ie. "no internet", airplane mode scenario
//  completion\notification: ie. "success\saved", upload record result scenario
//  tasks\working\progress: ie. "downloading\uploading" scenario
const StatusBar = ({ text, type, onDone }) => {
  // nothing to render
  if (!text) {
    return null;
  }

  // `static` does not animate
  if (text && type == `static`) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }

  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 1

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 5000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && onDone) {
        onDone();
      }
    });
  }, [fadeAnim]);

  // notification - short lived status
  if (text && type == `notification`) {
    return (
      <Animated.Text style={[styles.container, { opacity: fadeAnim }]}>
        {text}
      </Animated.Text>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    backgroundColor: "lightgrey",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});

StatusBar.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
  onDone: PropTypes.func,
};

export { StatusBar };
