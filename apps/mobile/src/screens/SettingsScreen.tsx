import React, { useContext, useState } from "react";
import { Appearance } from "react-native";
import { Heading, Switch, Text, View, XStack, YStack } from "tamagui";
import {
  Divider,
  DiskUsage,
  ThemedBox,
  UserIdentityInput,
} from "../components";
import { getAppSettings, setAppSettings } from "../../AppSettings";
import { colorModeManager } from "../providers";
import { ThemeContext } from "../../App";
import { Headers, Labels, TestIds } from "../constants";

type SettingsGroupProps = {
  label: string;
  children: JSX.Element;
};

function SettingsGroup({ label, children }: SettingsGroupProps) {
  return (
    <View paddingHorizontal="$2">
      <Heading marginVertical="$1" size="$3">
        {label}
      </Heading>
      {children}
    </View>
  );
}

type SettingsGroupItemProps = {
  label: string;
  right:
    | JSX.Element
    | ((props: { setLabel: (value: string) => void }) => JSX.Element);
};

function SettingsGroupItem({ label, right }: SettingsGroupItemProps) {
  const [labelValue, setLabel] = useState(label);

  return (
    <XStack height={40} justifyContent="space-between">
      <Text marginTop="$3" fontSize="$4">
        {labelValue}
      </Text>
      {typeof right == "function" ? right({ setLabel }) : right}
    </XStack>
  );
}

export function SettingsScreen() {
  const [{ showGpsWarning }, setSettings] = useState(getAppSettings());
  const { themeName, setThemeName } = useContext(ThemeContext);

  const toggleColorModeAndPersist = () => {
    const next = themeName === "light" ? "dark" : "light";
    colorModeManager.set(next);
    Appearance.setColorScheme(next);
    setThemeName(next);
  };

  return (
    <ThemedBox>
      <YStack>
        <View marginBottom="$1">
          <SettingsGroup label={Headers.Profile}>
            <UserIdentityInput />
          </SettingsGroup>
        </View>
        <Divider />

        <SettingsGroup label={Headers.Prompts}>
          <SettingsGroupItem
            label={Labels.SettingsScreen.ManualCoordinates}
            right={
              <Switch
                testID={TestIds.SettingsScreen.ShowGpsWarning}
                onCheckedChange={() => {
                  setSettings((prev) => ({
                    ...setAppSettings({
                      ...prev,
                      showGpsWarning: !prev.showGpsWarning,
                    }),
                  }));
                }}
                checked={!showGpsWarning}
              >
                <Switch.Thumb />
              </Switch>
            }
          />
        </SettingsGroup>
        <Divider />

        <SettingsGroup label={Headers.Theme}>
          <SettingsGroupItem
            label={Labels.SettingsScreen.DarkMode}
            right={
              <Switch
                testID="Dark Mode"
                onCheckedChange={toggleColorModeAndPersist}
                checked={themeName === "light"}
              >
                <Switch.Thumb />
              </Switch>
            }
          />
        </SettingsGroup>
        <Divider />

        <SettingsGroup label={Headers.DiskUsage}>
          <SettingsGroupItem label="Calculating" right={DiskUsage} />
        </SettingsGroup>
      </YStack>
    </ThemedBox>
  );
}
