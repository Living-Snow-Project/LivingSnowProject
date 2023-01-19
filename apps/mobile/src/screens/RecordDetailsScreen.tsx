import React from "react";
import { Box, ScrollView, Text, useColorModeValue } from "native-base";
import {
  AlgaeRecord,
  jsonToRecord,
  recordDateFormat,
} from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { CachedPhotos, ThemedBox } from "../components";
import { Labels } from "../constants";

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
      <ThemedBox pb={1}>
        <Box bgColor={headerColor}>
          <Text textAlign="center">{Labels.RecordDetailsScreen.DataSheet}</Text>
        </Box>
        <Box px={2}>
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
      </ThemedBox>
      <CachedPhotos photos={photos} />
    </ScrollView>
  );
}
