import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { downloadPhotoUri } from "../lib/Network";
import { getAtlasPickerItem } from "../record/Atlas";
import { isAtlas } from "../record/Record";
import { Labels } from "../constants/Strings";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topImage: {
    flex: 1,
  },
  image: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "black",
  },
});

// TODO: make an encapsulated Record object
function parsePhotoUris(photoUris) {
  if (!photoUris) {
    return [];
  }

  const result = photoUris.split(`;`);
  result.pop();

  return result;
}

export default function RecordDetailsScreen({ route }) {
  const {
    date,
    type,
    name,
    organization,
    locationDescription,
    latitude,
    longitude,
    tubeId,
    notes,
    atlasType,
  } = route.params;
  const photoUris = parsePhotoUris(route.params.photoUris);
  // TODO: prefer to scale images based on its dominant axis
  // which means the server needs to store height, width
  const height = Dimensions.get("screen").height * 0.75;

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
        <Text>{`${Labels.RecordFields.Date}: ${date.slice(0, 10)}`}</Text>
        {/* BUGBUG: downloaded records type=string, pending records type=enum and converted to string */}
        <Text>{`${Labels.RecordFields.Type}: ${type}`}</Text>
        <Text>{`${Labels.RecordFields.Name}: ${name}`}</Text>
        {!!organization && (
          <Text>{`${Labels.RecordFields.Organization}: ${organization}`}</Text>
        )}
        <Text>{`${Labels.RecordFields.GPSCoordinates}: ${latitude}, ${longitude}`}</Text>
        {!!tubeId && <Text>{`${Labels.RecordFields.TubeId}: ${tubeId}`}</Text>}
        {isAtlas(type) && (
          <Text>{`${Labels.RecordFields.AtlasSnowSurface}: ${
            // BUGBUG: pickerItem.label... really?
            getAtlasPickerItem(atlasType).label
          }`}</Text>
        )}
        {!!locationDescription && (
          <Text>{`${Labels.RecordFields.LocationDescription}: ${locationDescription}`}</Text>
        )}
        {!!notes && <Text>{`${Labels.RecordFields.Notes}: ${notes}`}</Text>}
      </View>
      {photoUris.length > 0 && (
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
              {Labels.RecordFields.Photos}
            </Text>
          </View>
          <View style={{ flex: photoUris.length, flexDirection: "column" }}>
            {photoUris.map((x, index) => (
              <View
                style={[
                  index === 0 ? styles.topImage : styles.image,
                  { width: "100%", height },
                ]}
                /* eslint-disable react/no-array-index-key */
                key={index}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{ uri: x.includes(`file`) ? x : downloadPhotoUri(x) }}
                />
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

RecordDetailsScreen.propTypes = {
  // TODO: make an encapsulated Record object (in TypeScript)
  // eslint-disable-next-line react/forbid-prop-types
  route: PropTypes.object.isRequired,
};
