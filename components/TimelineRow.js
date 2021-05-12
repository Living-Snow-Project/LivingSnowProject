import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { PictureIcon, RecordIcon } from '../components/TabBarIcon';
import { Routes } from '../navigation/Routes';

function empty(text) {
  return !text;
}

function topText({date, name, organization, latitude, longitude}) {
  let result = `${date.slice(0, 10)}\n`;
  
  if (!empty(name)) {
    result += name;

    if (!empty(organization)) {
      result += ` (${organization})`;
    }
  }
  else {
    result += `unknown Scientist`;
  }

  result += `\nLocation: ${latitude}, ${longitude}`;

  return result;
}

function bottomText({locationDescription, notes}) {
  let result = '';
  let newline = '';

  if (!empty(locationDescription)) {
    result += `Description: ${locationDescription}`;
    newline = '\n';
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

  let result = photoUris.split(`;`);
  result.pop();

  return result;
}

const TimelineRow = ({navigation, record}) => {
  return (
    <View style={styles.recordContainer}>
      <Pressable onPress={() => navigation.navigate(Routes.RecordDetailsScreen, {record: record})}>
        <View style={styles.recordTop}>
          <View style={styles.topText}>
            <Text>{topText(record)}</Text>
          </View>
          <View style={styles.topIcon}>
            <RecordIcon type={record.type}/>
          </View>
          {!empty(record.photoUris) && 
          <View style={styles.topIcon}>
            <PictureIcon/>
            <View style={{position: 'absolute', alignSelf: 'flex-end', top: 1, right: 2, backgroundColor: 'red', borderRadius: 40, alignItems: 'center', width: '35%', height: '35%'}}>
              <Text style={{color: 'white'}} >{parsePhotoUris(record.photoUris).length}</Text>            
            </View>
          </View>}
        </View>
        {(!empty(record.locationDescription) || !empty(record.notes)) && <Text style={styles.bottomText}>{bottomText(record)}</Text>}
      </Pressable>
    </View>
  );
}

TimelineRow.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  record: PropTypes.shape({
    type: PropTypes.string.isRequired,
    photoUris: PropTypes.string,
    locationDescription: PropTypes.string,
    notes: PropTypes.string,
  })
};

export { TimelineRow };

const styles = StyleSheet.create({
  recordContainer: {
    borderColor: '#000000',
    borderStyle: 'solid',
    borderBottomWidth: 1
  },
  recordTop: {
    flexDirection: 'row',
    flex: 1
  },
  topText: {
    marginLeft: 1,
    flex: .7
  },
  topIcon: {
    marginLeft: 1,
    flex: .15
  }
});
