import React from "react";
import { Box, ScrollView, Text, useColorModeValue } from "native-base";
import { jsonToRecord, recordDateFormat } from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { CachedPhotos, ThemedBox } from "../components";
import { Labels } from "../constants";
import { MinimalAlgaeRecordV3 } from "../../types";

type RecordDetailsScreenProps = {
  route: RecordDetailsScreenRouteProp;
};

export function RecordDetailsScreen({ route }: RecordDetailsScreenProps) {
  const { record, photos } = jsonToRecord<MinimalAlgaeRecordV3>(
    route.params.record
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
          {/* TODO-BILL: use localized labels for new questions */}
          {isOnGlacier && <Text>{`${"Was On Glacier?"}: ${isOnGlacier}`}</Text>}
          {/* if they were on a glacier, did they see exposed ice */}
          {!!seeExposedIceOrWhatIsUnderSnowpack && isOnGlacier && (
            <Text>{`${"See Exposed Ice?"}: ${seeExposedIceOrWhatIsUnderSnowpack}`}</Text>
          )}
          {/* if they were not on a glacier, what was under the snowpack */}
          {!!seeExposedIceOrWhatIsUnderSnowpack && !isOnGlacier && (
            <Text>{`${"What was under snowpack?"}: ${seeExposedIceOrWhatIsUnderSnowpack}`}</Text>
          )}
          {!!snowpackDepth && (
            <Text>{`${"Snowpack Depth"}: ${snowpackDepth}`}</Text>
          )}
          {!!bloomDepth && <Text>{`${"Bloom Depth"}: ${bloomDepth}`}</Text>}
          {!!impurities && (
            <Text>{`${"Impurities"}: ${impurities.reduce<string>(
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
