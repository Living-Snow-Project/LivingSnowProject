import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { AlgaeRecord, Photo } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { Divider, ThemedBox } from "../layout";
import { UserStyle } from "./UserStyle";
import { PhotosLayout } from "../media";
import { MinimalAlgaeRecord } from "../../../types";

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
  photos?: Photo[];
  actionsMenu?: JSX.Element;
};

export function TimelineRow({ record, photos, actionsMenu }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const recordDetail: MinimalAlgaeRecord = {
    record: { ...record },
    photos: photos ? [...photos] : undefined,
  };

  return (
    <>
      <Pressable
        testID={record.id}
        onPress={() =>
          navigate("RecordDetails", { record: JSON.stringify(recordDetail) })
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
