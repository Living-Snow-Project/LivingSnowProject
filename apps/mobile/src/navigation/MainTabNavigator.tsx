import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { XStack, useTheme } from "tamagui";
import { useThemeContext } from "../providers/Theme";
import {
  FirstRunScreen,
  RecordDetailsScreen,
  RecordScreen,
  SettingsScreen,
  TimelineScreen,
} from "../screens";
import AlgaeProbabilityMap from "../map/AlgaeProbabilityMap";
import { HeaderButton } from "../components/screens";
import { RootStackParamList, RootStackNavigationProp } from "./Routes";
import { getAppSettings } from "../../AppSettings";
import { TestIds } from "../constants/TestIds";
import i18n from "../i18n/index";

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

type MapButtonProps = {
  navigation: RootStackNavigationProp;
};

function MapButton({ navigation }: MapButtonProps) {
  return (
    <HeaderButton
      testID={TestIds.TimelineScreen.MapButton}
      onPress={() => navigation.navigate("Map")}
      iconName="map-outline"
      placement="right"
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
      {/* TODO: remove this before shipping! */}
      {true && (
        <Stack.Screen
          name="Welcome"
          component={FirstRunScreen}
          options={{
            // The title in the header
            title: i18n.t("welcomeHeading"),
          }}
        />
      )}
      <Stack.Screen
        name="Timeline"
        component={TimelineScreen}
        options={({ navigation }: { navigation: RootStackNavigationProp }) => ({
          headerLeft: () => SettingsButton({ navigation }),
          headerRight: () => (
            <XStack>
              <MapButton navigation={navigation} />
              <NewRecordButton navigation={navigation} />
            </XStack>
          ),
        })}
      />
      <Stack.Screen
        name="Map"
        component={AlgaeProbabilityMap}
        options={{
          title: "Map",
          headerShown: true,
        }}
      />
      <Stack.Screen name="Record" component={RecordScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="RecordDetails"
        component={RecordDetailsScreen}
        options={{ title: i18n.t("detailsHeading") }}
      />
    </Stack.Navigator>
  );
}

export function Navigation() {
  const { themeName } = useThemeContext();
  const tamaguiTheme = useTheme();

  const theme =
    themeName === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            primary: tamaguiTheme.blue10?.val ?? DarkTheme.colors.primary,
          },
          light: false as const,
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: tamaguiTheme.blue10?.val ?? DefaultTheme.colors.primary,
          },
          light: true as const,
        };

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// for testing
export { SettingsButton, NewRecordButton };
