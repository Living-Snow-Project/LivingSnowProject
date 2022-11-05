import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PictureIcon, RecordIcon } from "./Icons";
import { RootStackNavigationProp } from "../navigation/Routes";
import { AlgaeRecordPropType } from "../record/PropTypes";
import { Labels } from "../constants/Strings";
import { recordDateFormat } from "../record/Record";

const styles = StyleSheet.create({
  recordContainer: {
    backgroundColor: "white",
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

function topText({
  date,
  name,
  organization,
  latitude,
  longitude,
}: AlgaeRecord) {
  let result = `${recordDateFormat(date)}\n`;

  if (!empty(name)) {
    result += name;

    if (!empty(organization)) {
      result += ` (${organization})`;
    }
  } else {
    result += `Anonymous Scientist`;
  }

  result += `\n${Labels.RecordFields.GPSCoordinates}: ${latitude}, ${longitude}`;

  return result;
}

function bottomText({ locationDescription, notes }: AlgaeRecord) {
  let result = "";
  let newline = "";

  if (!empty(locationDescription)) {
    result += `${Labels.RecordFields.LocationDescription}: ${locationDescription}`;
    newline = "\n";
  }

  if (!empty(notes)) {
    result += `${newline}${Labels.RecordFields.Notes}: ${notes}`;
  }

  return result;
}

type TimelineRowProps = {
  record: AlgaeRecord;
};

export default function TimelineRow({ record }: TimelineRowProps) {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  return (
    <View style={styles.recordContainer}>
      <Pressable
        testID={record.id.toString()}
        onPress={() => navigate("RecordDetails", { record })}
      >
        <View style={styles.recordTop}>
          <View style={styles.topText}>
            <Text>{topText(record)}</Text>
          </View>
          <View style={styles.topIcon}>
            <RecordIcon type={record.type} />
          </View>
          {record.photos !== undefined && record.photos.length > 0 && (
            <View style={styles.topIcon}>
              <PictureIcon />
              <View style={styles.photosNotification}>
                <Text style={{ color: "white" }}>{record.photos.length}</Text>
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
  record: AlgaeRecordPropType.isRequired,
};
