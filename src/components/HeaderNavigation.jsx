import React from "react";
import { PropTypes } from "prop-types";
import { Platform, TouchableOpacity, View } from "react-native";
import { StockIcon } from "./TabBarIcon";

class HeaderNavigation extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate(this.props.nextScreen)}
          activeOpacity={0.4}
        >
          <View>
            <StockIcon
              name={
                Platform.OS === "ios"
                  ? this.props.iosImage
                  : this.props.androidImage
              }
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

HeaderNavigation.propTypes = {
  iosImage: PropTypes.string.isRequired,
  androidImage: PropTypes.string.isRequired,
  nextScreen: PropTypes.string.isRequired,
};

export default HeaderNavigation;
