import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import { PictureIcon, RecordIcon } from "./Icons";
import { RootStackNavigationProp } from "../navigation/Routes";
import RecordPropType from "../record/RecordPropTypes";

const styles = StyleSheet.create({
  recordContainer: {
    borderBottomWidth: 1,
  },
  recordTop: {
    flexDirection: "row",
    flex: 1,
  },
  topText: {
    marginLeft: 1,
    flex: 0.7,
  },
  topIcon: {
    marginLeft: 1,
    flex: 0.15,
  },
  photosNotification: {
    position: "absolute",
    alignSelf: "flex-end",
    top: 1,
    right: 2,
    backgroundColor: "red",
    borderRadius: 40,
    alignItems: "center",
    width: "33%",
  },
});

function empty(text) {
  return !text;
}

function topText({ date, name, organization, latitude, longitude }) {
  let result = `${date.slice(0, 10)}\n`;

  if (!empty(name)) {
    result += name;

    if (!empty(organization)) {
      result += ` (${organization})`;
    }
  } else {
    result += `Anonymous Scientist`;
  }

  result += `\nLocation: ${latitude}, ${longitude}`;

  return result;
}

function bottomText({ locationDescription, notes }) {
  let result = "";
  let newline = "";

  if (!empty(locationDescription)) {
    result += `Description: ${locationDescription}`;
    newline = "\n";
  }

  if (!empty(notes)) {
    result += `${newline}Notes: ${notes}`;
  }

  return result;
}

// TODO: make a recordClosure object
function parsePhotoUris(photoUris) {
  if (!photoUris) {
    return [];
  }

  const result = photoUris.split(`;`);
  result.pop();

  return result;
}

export default function TimelineRow({ record }) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  return (
    <View style={styles.recordContainer}>
      <Pressable
        testID={record.id}
        onPress={() => navigate("RecordDetails", record)}
      >
        <View style={styles.recordTop}>
          <View style={styles.topText}>
            <Text>{topText(record)}</Text>
          </View>
          <View style={styles.topIcon}>
            <RecordIcon type={record.type} />
          </View>
          {!empty(record.photoUris) && (
            <View style={styles.topIcon}>
              <PictureIcon />
              <View style={styles.photosNotification}>
                <Text style={{ color: "white" }}>
                  {parsePhotoUris(record.photoUris).length}
                </Text>
              </View>
            </View>
          )}
        </View>
        {(!empty(record.locationDescription) || !empty(record.notes)) && (
          <Text>{bottomText(record)}</Text>
        )}
      </Pressable>
    </View>
  );
}

TimelineRow.propTypes = {
  record: PropTypes.shape(RecordPropType).isRequired,
};
