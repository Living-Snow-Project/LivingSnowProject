import React from "react";
import { PropTypes } from "prop-types";
import { StyleSheet, Text } from "react-native";

export default class MonoText extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[this.props.style, { fontFamily: "space-mono" }]}
      />
    );
  }
}

MonoText.propTypes = {
  style: PropTypes.instanceOf(StyleSheet),
};

MonoText.defaultProps = {
  style: undefined,
};
