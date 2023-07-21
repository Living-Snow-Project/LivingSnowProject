import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { Asset } from "expo-media-library";
import { AlgaeRecord, AppPhoto } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { Divider, ThemedBox } from "../layout";
import { UserStyle } from "./UserStyle";
import { PhotosLayout } from "../media";

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
  photos?: AppPhoto[] | Asset[];
  actionsMenu?: JSX.Element;
};

export function TimelineRow({ record, photos, actionsMenu }: TimelineRowProps) {
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
        <PhotosLayout photos={photos} />
      </Pressable>
      <Divider />
    </>
  );
}
