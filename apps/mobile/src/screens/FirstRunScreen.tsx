import React from "react";
import { Box, Button, HStack, VStack, Text } from "native-base";
import { SnowIcon, UserIdentityInput } from "../components";
import { setAppSettings } from "../../AppSettings";
import { FirstRunScreenNavigationProp } from "../navigation/Routes";
import { Labels } from "../constants";

type FirstRunScreenProps = {
  navigation: FirstRunScreenNavigationProp;
};

export function FirstRunScreen({ navigation }: FirstRunScreenProps) {
  return (
    <Box px={3} mt={2}>
      <HStack alignItems="center" justifyContent="space-between">
        <SnowIcon />
        <SnowIcon />
        <VStack>
          <Text fontWeight="bold" fontSize="xl" color="pink.600">
            {Labels.LivingSnowProject}
          </Text>
          <Text color="pink.500">{Labels.Slogan}</Text>
        </VStack>
        <SnowIcon />
        <SnowIcon />
      </HStack>

      <Text my={2}>{Labels.FirstRunScreen.Usage}</Text>

      <UserIdentityInput />

      <Box alignItems="center">
        <Button
          mt={5}
          width={200}
          onPress={() => {
            setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
            navigation.navigate("Timeline");
          }}
        >
          {Labels.FirstRunScreen.StartReporting}
        </Button>
      </Box>
    </Box>
  );
}
