import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderButton from "../components/HeaderButton";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import { RootStackParamList } from "./Routes";
import { getAppSettings } from "../../AppSettings";

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { showFirstRun } = getAppSettings();

  const TimelineLeft = useCallback(
    (navigation) => (
      <HeaderButton
        onPress={() => navigation.navigate("Settings")}
        iconName="settings"
        placement="left"
      />
    ),
    []
  );

  const TimelineRight = useCallback(
    (navigation) => (
      <HeaderButton
        onPress={() => navigation.navigate("Record")}
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
        <Stack.Screen name="Welcome" component={FirstRunScreen} />
      )}
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={({ navigation }) => ({
          headerLeft: () => TimelineLeft(navigation),
          headerRight: () => TimelineRight(navigation),
        })}
      />
      <Stack.Screen name="Record" component={RecordScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="ImageSelection"
        component={ImagesPickerScreen}
        options={{ title: "Camera Roll" }}
      />
      <Stack.Screen
        name="RecordDetails"
        component={RecordDetailsScreen}
        options={{ title: "Details" }}
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
