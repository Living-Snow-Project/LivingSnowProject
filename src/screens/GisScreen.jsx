import React from "react";
import { Text } from "react-native";

export default class GisScreen extends React.Component {
  static navigationOptions = {
    title: "Coming soon...",
    headerTitleContainerStyle: { justifyContent: "center" },
  };

  render() {
    // return <ExpoConfigView />;
    return (
      <Text style={{ textAlign: "center" }}>
        This feature is not yet implemented...
      </Text>
    );
  }
}
