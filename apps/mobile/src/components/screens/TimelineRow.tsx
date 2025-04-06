import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { AlgaeRecordV3, Photo } from "@livingsnow/record";
import { RootStackNavigationProp } from "../../navigation/Routes";
import { Divider, ThemedBox } from "../layout";
import { UserStyle } from "./UserStyle";
import { PhotosLayout } from "../media";
import { MinimalAlgaeRecordV3 } from "../../../types";

function bottomText({
  locationDescription,
  notes,
}: AlgaeRecordV3): JSX.Element[] | null {
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
  record: AlgaeRecordV3;
  photos?: Photo[];
  actionsMenu?: JSX.Element;
};

export function TimelineRow({ record, photos, actionsMenu }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const recordDetail: MinimalAlgaeRecordV3 = {
    record: { ...record },
    photos: photos ? [...photos] : undefined,
  };

  return (
    <>
      <Pressable
        testID={`${record.id}`}
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
