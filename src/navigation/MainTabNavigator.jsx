import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderNavigation from "../components/HeaderNavigation";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import Routes from "./Routes";
import { getAppSettings } from "../../AppSettings";

const Stack = createStackNavigator();

function TimelineLeft(navigation) {
  return (
    <HeaderNavigation
      navigation={navigation}
      nextScreen={Routes.SettingsScreen}
      iosImage="ios-settings"
      androidImage="md-settings"
    />
  );
}

function TimelineRight(navigation) {
  return (
    <HeaderNavigation
      navigation={navigation}
      nextScreen={Routes.RecordScreen}
      iosImage="ios-add-circle-outline"
      androidImage="md-add-circle-outline"
    />
  );
}

function RootNavigator() {
  const { showFirstRun } = getAppSettings();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true, headerTitleAlign: "center" }}
    >
      {showFirstRun && (
        <Stack.Screen name={Routes.FirstRunScreen} component={FirstRunScreen} />
      )}
      <Stack.Screen
        name={Routes.TimelineScreen}
        component={TimelineScreen}
        options={({ navigation }) => ({
          headerLeft: () => TimelineLeft(navigation),
          headerLeftContainerStyle: { marginLeft: 20 },
          headerRight: () => TimelineRight(navigation),
          headerRightContainerStyle: { marginRight: 20 },
        })}
      />
      <Stack.Screen name={Routes.RecordScreen} component={RecordScreen} />
      <Stack.Screen name={Routes.SettingsScreen} component={SettingsScreen} />
      <Stack.Screen
        name={Routes.ImagesPickerScreen}
        component={ImagesPickerScreen}
      />
      <Stack.Screen
        name={Routes.RecordDetailsScreen}
        component={RecordDetailsScreen}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
