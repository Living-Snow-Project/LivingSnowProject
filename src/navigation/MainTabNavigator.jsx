import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderButton from "../components/HeaderNavigation";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import Routes from "./Routes";
import { getAppSettings } from "../../AppSettings";

const Stack = createStackNavigator();

function RootNavigator() {
  const { showFirstRun } = getAppSettings();

  const TimelineLeft = useCallback(
    (navigation) => (
      <HeaderButton
        onPress={() => navigation.navigate(Routes.SettingsScreen)}
        iconName="settings"
        placement="left"
      />
    ),
    []
  );

  const TimelineRight = useCallback(
    (navigation) => (
      <HeaderButton
        onPress={() => navigation.navigate(Routes.RecordScreen)}
        iconName="add-circle-outline"
        placement="right"
      />
    ),
    []
  );

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
          headerRight: () => TimelineRight(navigation),
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
