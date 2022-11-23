import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderButton from "../components/HeaderButton";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import { RootStackParamList, RootStackNavigationProp } from "./Routes";
import { getAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";

const Stack = createNativeStackNavigator<RootStackParamList>();

type SettingsButtonProps = {
  navigation: RootStackNavigationProp;
};

function SettingsButton({ navigation }: SettingsButtonProps) {
  return (
    <HeaderButton
      testID={TestIds.TimelineScreen.SettingsButton}
      onPress={() => navigation.navigate("Settings")}
      iconName="settings-outline"
      placement="left"
    />
  );
}

type NewRecordButtonProps = {
  navigation: RootStackNavigationProp;
};

function NewRecordButton({ navigation }: NewRecordButtonProps) {
  return (
    <HeaderButton
      testID={TestIds.TimelineScreen.NewRecordButton}
      onPress={() => navigation.navigate("Record")}
      iconName="add-circle-outline"
      placement="right"
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
        <Stack.Screen name="Welcome" component={FirstRunScreen} />
      )}
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={({ navigation }: { navigation: RootStackNavigationProp }) => ({
          headerLeft: () => SettingsButton({ navigation }),
          headerRight: () => NewRecordButton({ navigation }),
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

export { SettingsButton, NewRecordButton };
