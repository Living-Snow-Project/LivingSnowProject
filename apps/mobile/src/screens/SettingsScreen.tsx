import React, { useState } from "react";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Switch,
  Text,
  VStack,
  useColorMode,
} from "native-base";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import { getAppSettings, setAppSettings } from "../../AppSettings";
import { Headers, Labels } from "../constants/Strings";
import TestIds from "../constants/TestIds";

export default function SettingsScreen() {
  const [{ showGpsWarning }, setSettings] = useState(getAppSettings());
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <VStack mx="3">
        <Heading mt={3} mb={1} size="sm">
          {Headers.UserInformation}
        </Heading>
        <Box>
          <UserIdentityInput />
        </Box>

        <Heading mt={3} mb={1} size="sm">
          {Headers.Prompts}
        </Heading>
        <Box>
          <HStack justifyContent="space-between">
            <Center>
              <Text fontSize="md">
                {Labels.SettingsScreen.ManualCoordinates}
              </Text>
            </Center>
            <Switch
              testID={TestIds.SettingsScreen.ShowGpsWarning}
              onValueChange={(value) => {
                setSettings((prev) => ({
                  ...setAppSettings({ ...prev, showGpsWarning: value }),
                }));
              }}
              isChecked={showGpsWarning}
            />
          </HStack>
          <Divider mt={2} />
        </Box>

        <Heading mt={3} mb={1} size="sm">
          {Headers.Theme}
        </Heading>
        <HStack justifyContent="space-between">
          <Center>
            <Text fontSize="md">{Labels.SettingsScreen.DarkMode}</Text>
          </Center>
          <Switch
            testID="Dark Mode"
            onValueChange={toggleColorMode}
            isChecked={colorMode == "dark"}
          />
        </HStack>
      </VStack>
    </Box>
  );
}
