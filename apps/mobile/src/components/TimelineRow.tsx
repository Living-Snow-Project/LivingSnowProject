import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { AlgaeRecord } from "@livingsnow/record";
import { RootStackNavigationProp } from "../navigation/Routes";
import { ThemedBox } from "./ThemedBox";
import { UserStyle } from "./UserStyle";
import { PhotosLayout } from "./PhotosLayout";
import { Divider } from "./Divider";

function bottomText({
  locationDescription,
  notes,
}: AlgaeRecord): JSX.Element[] | null {
  const result: JSX.Element[] = [];
  if (locationDescription) {
    result.push(
      <Text key={0} fontWeight="500">
        {locationDescription}
      </Text>
    );
  }

  if (notes) {
    result.push(<Text key={1}>{notes}</Text>);
  }

  return result.length > 0 ? result : null;
}

type TimelineRowProps = {
  record: AlgaeRecord;
  actionsMenu?: JSX.Element;
};

export function TimelineRow({ record, actionsMenu }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();

  return (
    <>
      <Pressable
        testID={record.id.toString()}
        onPress={() =>
          navigate("RecordDetails", { record: JSON.stringify(record) })
        }
      >
        <ThemedBox px={2} py={1}>
          <VStack>
            <HStack>
              <UserStyle record={record} />
              <Box width="7%">{actionsMenu}</Box>
            </HStack>
            {bottomText(record)}
          </VStack>
        </ThemedBox>
        <PhotosLayout photos={record.photos} />
      </Pressable>
      <Divider />
    </>
  );
}
