import React, { useState } from "react";
import {
  Box,
  Heading,
  HStack,
  Switch,
  Text,
  VStack,
  useColorMode,
} from "native-base";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import DiskUsage from "../components/DiskUsage";
import Divider from "../components/Divider";
import { getAppSettings, setAppSettings } from "../../AppSettings";
import { colorModeManager } from "../providers";
import { Headers, Labels } from "../constants/Strings";
import TestIds from "../constants/TestIds";

type SettingsGroupProps = {
  label: string;
  children: JSX.Element;
};

function SettingsGroup({ label, children }: SettingsGroupProps) {
  return (
    <Box px="2">
      <Heading my={1} size="sm">
        {label}
      </Heading>
      {children}
    </Box>
  );
}

type SettingsGroupItemProps = {
  label: string;
  right:
    | JSX.Element
    | ((props: { setLabel: (value: string) => void }) => JSX.Element);
};

function SettingsGroupItem({ label, right }: SettingsGroupItemProps) {
  const [labelValue, setLabelValue] = useState(label);
  const setLabel = (value: string) => setLabelValue(value);

  return (
    <HStack pb="1" height="10" justifyContent="space-between">
      <Text mt="3" fontSize="md">
        {labelValue}
      </Text>
      {typeof right == "function" ? right({ setLabel }) : right}
    </HStack>
  );
}

export default function SettingsScreen() {
  const [{ showGpsWarning }, setSettings] = useState(getAppSettings());
  const { colorMode, toggleColorMode } = useColorMode();

  const toggleColorModeAndPersist = () => {
    colorModeManager.set(colorMode == "light" ? "dark" : "light");
    toggleColorMode();
  };

  return (
    <Box _dark={{ bg: "dark.100" }}>
      <VStack>
        <SettingsGroup label={Headers.Profile}>
          <UserIdentityInput />
        </SettingsGroup>
        <Divider />

        <SettingsGroup label={Headers.Prompts}>
          <SettingsGroupItem
            label={Labels.SettingsScreen.ManualCoordinates}
            right={
              <Switch
                testID={TestIds.SettingsScreen.ShowGpsWarning}
                onValueChange={(value) => {
                  setSettings((prev) => ({
                    ...setAppSettings({ ...prev, showGpsWarning: value }),
                  }));
                }}
                isChecked={showGpsWarning}
              />
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
                onValueChange={toggleColorModeAndPersist}
                isChecked={colorMode == "dark"}
              />
            }
          />
        </SettingsGroup>
        <Divider />

        <SettingsGroup label={Headers.DiskUsage}>
          <SettingsGroupItem label="Calculating" right={DiskUsage} />
        </SettingsGroup>
      </VStack>
    </Box>
  );
}
