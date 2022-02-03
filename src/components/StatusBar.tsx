import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { Labels } from "../constants/Strings";

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

type StatusBarProps = {
  isConnected: boolean;
};

// status:
//  "no internet", airplane mode scenario
//  "success\saved", upload record result scenario
//  "downloading\uploading" scenario
//
// todo: this component should probably always be visible, or have a smooth shrinking transition to disappear
// currently when it stops rendering it feels very violent
export default function StatusBar({ isConnected }: StatusBarProps) {
  const text = Labels.StatusBar.NoConnection;

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

StatusBar.propTypes = {
  isConnected: PropTypes.bool.isRequired,
};
