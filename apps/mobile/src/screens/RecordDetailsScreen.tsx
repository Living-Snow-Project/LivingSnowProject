import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  AlgaeRecord,
  jsonToRecord,
  recordDateFormat,
} from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { Labels } from "../constants";
import { CachedPhotos } from "../components/CachedPhotos";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

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

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 2,
          margin: 2,
        }}
      >
        <View
          style={{
            borderColor: "black",
            borderBottomWidth: 1,
            backgroundColor: "lightblue",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {Labels.RecordDetailsScreen.DataSheet}
          </Text>
        </View>
        <Text>{`${Labels.Date}: ${recordDateFormat(date)}`}</Text>
        <Text>{`${Labels.RecordType}: ${type}`}</Text>
        <Text>{`${Labels.Name}: ${name}`}</Text>
        {!!organization && (
          <Text>{`${Labels.Organization}: ${organization}`}</Text>
        )}
        <Text>{`${Labels.RecordDetailsScreen.Gps}: ${latitude}, ${longitude}`}</Text>
        {!!tubeId && <Text>{`${Labels.TubeId}: ${tubeId}`}</Text>}
        {!!size && <Text>{`${Labels.RecordDetailsScreen.Size}: ${size}`}</Text>}
        {!!colors && (
          <Text>{`${Labels.RecordDetailsScreen.Colors}: ${colors.reduce<string>(
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
      </View>
      <CachedPhotos photos={photos} />
    </ScrollView>
  );
}
