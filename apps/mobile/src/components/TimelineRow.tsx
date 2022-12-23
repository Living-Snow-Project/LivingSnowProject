import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Pressable, Text, VStack } from "native-base";
import { AlgaeRecord, recordDateFormat } from "@livingsnow/record";
import { RootStackNavigationProp } from "../navigation/Routes";
import { getUserStyle } from "./UserStyle";
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

function getRecordInfo(record: AlgaeRecord) {
  // TODO: useColorModeValue
  return (
    <HStack>
      <Text fontWeight={700} color="blue.700">
        {`${record.type}`}
      </Text>
      <Text fontWeight={400} color="blue.700">
        {` on ${recordDateFormat(record.date)}`}
      </Text>
    </HStack>
  );
}

type TimelineRowProps = {
  record: AlgaeRecord;
};

export function TimelineRow({ record }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const { org, name, avatar } = getUserStyle(record.name, record.organization);

  return (
    <>
      <Pressable
        testID={record.id.toString()}
        onPress={() => navigate("RecordDetails", { record })}
      >
        <Box px={2} py={1} _dark={{ bg: "dark.100" }}>
          <VStack>
            <HStack>
              <Box width="15%">{avatar}</Box>
              <Box width="75%">
                <VStack ml={2}>
                  {name}
                  {org}
                  {getRecordInfo(record)}
                </VStack>
              </Box>
            </HStack>
            {bottomText(record)}
          </VStack>
        </Box>
        <PhotosLayout photos={record.photos} />
      </Pressable>
      <Divider />
    </>
  );
}
