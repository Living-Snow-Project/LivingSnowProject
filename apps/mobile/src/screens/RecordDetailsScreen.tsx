import React from "react";
import { Box, ScrollView, Text, useColorModeValue } from "native-base";
import {
  AlgaeRecord,
  jsonToRecord,
  recordDateFormat,
} from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { Labels } from "../constants";
import { CachedPhotos } from "../components/CachedPhotos";

type RecordDetailsScreenProps = {
  route: RecordDetailsScreenRouteProp;
};

export function RecordDetailsScreen({ route }: RecordDetailsScreenProps) {
  const {
    date,
    type,
    name,
    organization,
    locationDescription,
    latitude,
    longitude,
    size,
    colors,
    tubeId,
    notes,
    photos,
  }: AlgaeRecord = jsonToRecord(route.params.record);

  const headerColor = useColorModeValue("lightBlue.300", "lightBlue.700");

  return (
    <ScrollView>
      <Box px={1} mb={1} _dark={{ bg: "dark.100" }}>
        <Box px={1} borderRadius={2} borderWidth={1}>
          <Box mx={-1} borderBottomWidth={1} bgColor={headerColor}>
            <Text textAlign="center">
              {Labels.RecordDetailsScreen.DataSheet}
            </Text>
          </Box>
          <Text>{`${Labels.Date}: ${recordDateFormat(date)}`}</Text>
          <Text>{`${Labels.RecordType}: ${type}`}</Text>
          <Text>{`${Labels.Name}: ${name}`}</Text>
          {!!organization && (
            <Text>{`${Labels.Organization}: ${organization}`}</Text>
          )}
          <Text>{`${Labels.RecordDetailsScreen.Gps}: ${latitude}, ${longitude}`}</Text>
          {!!tubeId && <Text>{`${Labels.TubeId}: ${tubeId}`}</Text>}
          {!!size && (
            <Text>{`${Labels.RecordDetailsScreen.Size}: ${size}`}</Text>
          )}
          {!!colors && (
            <Text>{`${
              Labels.RecordDetailsScreen.Colors
            }: ${colors.reduce<string>(
              (prev, cur, index) => (index == 0 ? `${cur}` : `${prev}, ${cur}`),
              ""
            )}`}</Text>
          )}
          {!!locationDescription && (
            <Text>{`${Labels.RecordDetailsScreen.LocationDescription}: ${locationDescription}`}</Text>
          )}
          {!!notes && (
            <Text>{`${Labels.RecordDetailsScreen.Notes}: ${notes}`}</Text>
          )}
        </Box>
      </Box>
      <CachedPhotos photos={photos} />
    </ScrollView>
  );
}
