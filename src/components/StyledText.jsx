import React from "react";
import { PropTypes } from "prop-types";
import { Text } from "react-native";

export class MonoText extends React.Component {
  static propTypes = {
    style: PropTypes.object,
  };

  render() {
    return (
      <Text
        {...this.props}
        style={[this.props.style, { fontFamily: "space-mono" }]}
      />
    );
  }
}
