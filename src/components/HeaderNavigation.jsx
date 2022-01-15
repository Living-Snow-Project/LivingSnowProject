import React from "react";
import { PropTypes } from "prop-types";
import { Platform, View } from "react-native";
import PressableOpacity from "./PressableOpacity";
import { StockIcon } from "./TabBarIcon";

export default function HeaderNavigation({
  navigation,
  iosImage,
  androidImage,
  nextScreen,
}) {
  return (
    <View>
      <PressableOpacity onPress={() => navigation.navigate(nextScreen)}>
        <View>
          <StockIcon name={Platform.OS === "ios" ? iosImage : androidImage} />
        </View>
      </PressableOpacity>
    </View>
  );
}

HeaderNavigation.propTypes = {
  iosImage: PropTypes.string.isRequired,
  androidImage: PropTypes.string.isRequired,
  nextScreen: PropTypes.string.isRequired,
};
