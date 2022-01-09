import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import TimelineScreen from "../screens/TimelineScreen";
import RecordScreen from "../screens/RecordScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FirstRunScreen from "../screens/FirstRunScreen";
import ImagesPickerScreen from "../screens/ImagesPickerScreen";
import HeaderNavigation from "../components/HeaderNavigation";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import Routes from "./Routes";
import { AppSettingsContext } from "../../AppSettings";

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
  const appSettings = useContext(AppSettingsContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {appSettings.showFirstRun && (
        <Stack.Screen
          name={Routes.FirstRunScreen}
          component={FirstRunScreen}
          options={{ headerTitle: "Welcome" }}
        />
      )}
      <Stack.Screen
        name={Routes.TimelineScreen}
        component={TimelineScreen}
        options={({ navigation }) => ({
          headerTitle: "Timeline",
          headerTitleContainerStyle: { justifyContent: "center" },
          headerLeft: () => TimelineLeft(navigation),
          headerLeftContainerStyle: { marginLeft: 20 },
          headerRight: () => TimelineRight(navigation),
          headerRightContainerStyle: { marginRight: 20 },
        })}
      />
      <Stack.Screen
        name={Routes.RecordScreen}
        component={RecordScreen}
        options={() => ({
          title: "Record",
          headerTitleContainerStyle: { justifyContent: "center" },
        })}
      />
      <Stack.Screen name={Routes.SettingsScreen} component={SettingsScreen} />
      <Stack.Screen
        name={Routes.ImagesPickerScreen}
        component={ImagesPickerScreen}
      />
      <Stack.Screen
        name={Routes.RecordDetailsScreen}
        component={RecordDetailsScreen}
        options={{ headerTitle: "Details" }}
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
