import React from "react";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { SnowIcon, UserIdentityInput } from "../components";
import { setAppSettings } from "../../AppSettings";
import { FirstRunScreenNavigationProp } from "../navigation/Routes";
import { Labels } from "../constants";

type FirstRunScreenProps = {
  navigation: FirstRunScreenNavigationProp;
};

export function FirstRunScreen({ navigation }: FirstRunScreenProps) {
  return (
    <View px="$3" mt="$2">
      <YStack alignItems="center">
        <XStack alignItems="center" justifyContent="space-between">
          <SnowIcon />
          <SnowIcon />
          <YStack alignItems="center">
            <Text fontWeight="bold" fontSize="$7" color="$pink10">
              {"  " + Labels.LivingSnowProject + "  "}
            </Text>
          </YStack>
          <SnowIcon />
          <SnowIcon />
        </XStack>
        <Text color="$pink9">{Labels.Slogan}</Text>
      </YStack>

      <Text my="$2">{Labels.FirstRunScreen.Usage}</Text>

      <UserIdentityInput />

      <View alignItems="center">
        <Button
          mt="$5"
          width={200}
          onPress={() => {
            setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
            navigation.navigate("Timeline");
          }}
        >
          {Labels.FirstRunScreen.StartReporting}
        </Button>
      </View>
    </View>
  );
}
