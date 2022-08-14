import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import PropTypes from "prop-types";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderButton from "../components/HeaderButton";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import { RootStackParamList } from "./Routes";
import { getAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";

const Stack = createNativeStackNavigator<RootStackParamList>();

function SettingsButton({ navigate }) {
  return (
    <HeaderButton
      testID={TestIds.TimelineScreen.SettingsButton}
      onPress={() => navigate("Settings")}
      iconName="settings"
      placement="left"
    />
  );
}

SettingsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

function NewRecordButton({ navigate }) {
  return (
    <HeaderButton
      testID={TestIds.TimelineScreen.NewRecordButton}
      onPress={() => navigate("Record")}
      iconName="add-circle-outline"
      placement="right"
    />
  );
}

NewRecordButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

function RootNavigator() {
  const { showFirstRun } = getAppSettings();

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
          headerLeft: () => SettingsButton(navigation),
          headerRight: () => NewRecordButton(navigation),
        })}
      />
      <Stack.Screen name="Record" component={RecordScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ gestureDirection: "horizontal" }}
      />
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

export { SettingsButton, NewRecordButton };
