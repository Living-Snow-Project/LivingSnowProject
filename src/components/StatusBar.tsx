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
  state: RecordRecuderStates;
  isConnected: boolean;
};

export default function StatusBar({ state, isConnected }: StatusBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {isConnected ? state : Labels.StatusBar.NoConnection}
      </Text>
    </View>
  );
}

StatusBar.propTypes = {
  isConnected: PropTypes.bool.isRequired,
};
