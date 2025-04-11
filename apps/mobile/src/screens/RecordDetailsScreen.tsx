import React from "react";
import { Box, ScrollView, Text, useColorModeValue } from "native-base";
import { jsonToRecord, recordDateFormat } from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { CachedPhotos, ThemedBox } from "../components";
import { Labels } from "../constants";
import { MinimalAlgaeRecordV3 } from "../../types";
import i18n from "../i18n";

type RecordDetailsScreenProps = {
  route: RecordDetailsScreenRouteProp;
};

export function RecordDetailsScreen({ route }: RecordDetailsScreenProps) {
  const { record, photos } = jsonToRecord<MinimalAlgaeRecordV3>(
    route.params.record,
  );

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
    isOnGlacier,
    seeExposedIceOrWhatIsUnderSnowpack,
    snowpackDepth,
    bloomDepth,
    impurities,
    tubeId,
    notes,
  } = record;

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
            <Text>{`${Labels.RecordDetailsScreen.Size}: ${size === "Other" ? "Other" : i18n.t(`algaeSizeDescription.${size}`)}`}</Text>
          )}
          {!!colors && (
            <Text>{`${
              Labels.RecordDetailsScreen.Colors
            }: ${colors.reduce<string>(
              (prev, cur, index) => (index == 0 ? `${cur}` : `${prev}, ${cur}`),
              "",
            )}`}</Text>
          )}
          {/* New questions */}
          {isOnGlacier && (
            <Text>
            {`${Labels.RecordDetailsScreen.WasOnGlacier}: ${i18n.t(`onOffGlacierDescription.${isOnGlacier ? "yes" : "no"}`)}`}
          </Text>
          )}
          {/* if they were on a glacier, did they see exposed ice */}
          {!!seeExposedIceOrWhatIsUnderSnowpack && isOnGlacier && (
            <Text>{`${Labels.RecordDetailsScreen.SeeExposedIce}: ${seeExposedIceOrWhatIsUnderSnowpack}`}</Text>
          )}
          {/* if they were not on a glacier, what was under the snowpack */}
          {!!seeExposedIceOrWhatIsUnderSnowpack && !isOnGlacier && (
            <Text>{`${Labels.RecordDetailsScreen.WhatWasUnderSnowpack}: ${seeExposedIceOrWhatIsUnderSnowpack}`}</Text>
          )}
          {!!snowpackDepth && (
            <Text>{`${Labels.RecordDetailsScreen.SnowPackDepth}: ${snowpackDepth}`}</Text>
          )}
          {!!bloomDepth && (
            <Text>{`${Labels.RecordDetailsScreen.BloomDepth}: ${bloomDepth}`}</Text>
          )}
          {!!impurities && (
            <Text>{`${Labels.RecordDetailsScreen.Impurities}: ${impurities.reduce<string>(
              (prev, cur, index) => (index == 0 ? `${cur}` : `${prev}, ${cur}`),
              "",
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
