import React from "react";
import { PropTypes } from "prop-types";
import { Platform, TouchableOpacity, View } from "react-native";
import { StockIcon } from "./TabBarIcon";

export default function HeaderNavigation({
  navigation,
  iosImage,
  androidImage,
  nextScreen,
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate(nextScreen)}
        activeOpacity={0.4}
      >
        <View>
          <StockIcon name={Platform.OS === "ios" ? iosImage : androidImage} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

HeaderNavigation.propTypes = {
  iosImage: PropTypes.string.isRequired,
  androidImage: PropTypes.string.isRequired,
  nextScreen: PropTypes.string.isRequired,
};
