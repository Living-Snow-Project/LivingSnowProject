import React, { useState } from "react";
import { Appearance } from "react-native";
import { Heading, Switch, Text, View, XStack, YStack } from "tamagui";
import {
  Divider,
  DiskUsage,
  ThemedBox,
  TamaguiPickerSelect,
  UserIdentityInput,
} from "../components";
import { getAppSettings, setAppSettings } from "../../AppSettings";
import { useThemeContext } from "../providers/Theme";
import { useLanguageContext } from "../providers/Language";
import { Headers, Labels, TestIds } from "../constants";
import i18n, { SUPPORTED_LOCALES } from "../i18n";

type SettingsGroupProps = {
  label: string;
  children: React.JSX.Element;
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
    | React.JSX.Element
    | ((props: { setLabel: (value: string) => void }) => React.JSX.Element);
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

const LANGUAGE_ITEMS = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "日本語" },
  { value: "nb", label: "Norsk Bokmål" },
  { value: "sv", label: "Svenska" },
  { value: "mn", label: "Монгол" },
];

export function SettingsScreen() {
  const [{ showGpsWarning }, setSettings] = useState(getAppSettings());
  const { themeName, setThemeName } = useThemeContext();
  const { language, setLanguage } = useLanguageContext();

  const toggleColorModeAndPersist = () => {
    const next = themeName === "light" ? "dark" : "light";
    setAppSettings((prev) => ({ ...prev, colorMode: next }));
    Appearance.setColorScheme(next);
    setThemeName(next);
  };

  const onLanguageChange = (value: string) => {
    if (!SUPPORTED_LOCALES.includes(value)) return;
    i18n.locale = value;
    setAppSettings((prev) => ({ ...prev, language: value }));
    setLanguage(value);
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
                checked={showGpsWarning}
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
                checked={themeName === "dark"}
              >
                <Switch.Thumb />
              </Switch>
            }
          />
        </SettingsGroup>
        <Divider />

        <SettingsGroup label={Headers.Language}>
          <TamaguiPickerSelect
            placeholder={Labels.SettingsScreen.Language}
            items={LANGUAGE_ITEMS}
            value={language}
            onValueChange={onLanguageChange}
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
