import React from "react";
import { ScrollView, Text, View } from "tamagui";
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

  return (
    <ScrollView>
      <ThemedBox pb={1}>
        <View
          backgroundColor="$blue4"
          $theme-dark={{ backgroundColor: "$blue8" }}
        >
          <Text textAlign="center">{Labels.RecordDetailsScreen.DataSheet}</Text>
        </View>
        <View paddingHorizontal="$2">
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
        </View>
      </ThemedBox>
      <CachedPhotos photos={photos} />
    </ScrollView>
  );
}
