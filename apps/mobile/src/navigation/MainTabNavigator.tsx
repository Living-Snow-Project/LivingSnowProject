import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorModeValue, useTheme, Box } from "native-base";
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
      {showFirstRun && (
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
            <Box flexDirection="row">
              {<MapButton navigation={navigation} />}
              <NewRecordButton navigation={navigation} />
            </Box>
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
  const nbTheme = useTheme();
  const theme = useColorModeValue(
    {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: nbTheme.colors.primary[600],
      },
      light: true,
    },
    {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: nbTheme.colors.primary[400],
      },
      light: false,
    },
  );

  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// for testing
export { SettingsButton, NewRecordButton };
