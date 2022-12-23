import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AlgaeRecord, recordDateFormat } from "@livingsnow/record";
import { RecordDetailsScreenRouteProp } from "../navigation/Routes";
import { Labels } from "../constants/Strings";
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
    color,
    tubeId,
    notes,
    photos,
  }: AlgaeRecord = route.params.record;

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
          <Text style={{ textAlign: "center" }}>Data Sheet</Text>
        </View>
        <Text>{`${Labels.RecordFields.Date}: ${recordDateFormat(date)}`}</Text>
        <Text>{`${Labels.RecordFields.Type}: ${type}`}</Text>
        <Text>{`${Labels.RecordFields.Name}: ${name}`}</Text>
        {!!organization && (
          <Text>{`${Labels.RecordFields.Organization}: ${organization}`}</Text>
        )}
        <Text>{`${Labels.RecordFields.GPSCoordinates}: ${latitude}, ${longitude}`}</Text>
        {!!tubeId && <Text>{`${Labels.RecordFields.TubeId}: ${tubeId}`}</Text>}
        {!!size && <Text>{`${Labels.RecordFields.Size}: ${size}`}</Text>}
        {!!color && <Text>{`${Labels.RecordFields.Color}: ${color}`}</Text>}
        {!!locationDescription && (
          <Text>{`${Labels.RecordFields.LocationDescription}: ${locationDescription}`}</Text>
        )}
        {!!notes && <Text>{`${Labels.RecordFields.Notes}: ${notes}`}</Text>}
      </View>
      <CachedPhotos photos={photos} />
    </ScrollView>
  );
}
