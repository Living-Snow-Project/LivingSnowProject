import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  HStack,
  Pressable,
  Text,
  ThreeDotsIcon,
  VStack,
} from "native-base";
import { AlgaeRecord, recordDateFormat } from "@livingsnow/record";
import { RootStackNavigationProp } from "../navigation/Routes";
import getUserStyle from "./UserStyle";

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
};

export default function TimelineRow({ record }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const { org, name, avatar } = getUserStyle(record.name, record.organization);
  // useCachedPhotos

  return (
    <Box px={2} py={1}>
      <Pressable
        testID={record.id.toString()}
        onPress={() => navigate("RecordDetails", { record })}
      >
        <VStack>
          <HStack>
            <Box width="15%">{avatar}</Box>
            <Box width="75%">
              <VStack ml={2}>
                {name}
                {org}
                <Text fontWeight={500} color="blue.700">
                  {`${record.type} on ${recordDateFormat(record.date)}`}
                </Text>
              </VStack>
            </Box>
            <Box>
              {/** generates a React key list error */}
              <ThreeDotsIcon />
            </Box>
          </HStack>
          {bottomText(record)}
          {/* photo(s) */}
        </VStack>
      </Pressable>
    </Box>
  );
}
