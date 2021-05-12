import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { downloadPhotoUri } from '../lib/Network';

// TODO: make a recordClosure object
function parsePhotoUris(photoUris) {
  if (!photoUris) {
    return [];
  }

  let result = photoUris.split(`;`);
  result.pop();

  return result;
}

function RecordDetailsScreen({route}) {
  const {date, type, name, organization, locationDescription, latitude, longitude, tubeId, notes} = route.params.record;
  const photoUris = parsePhotoUris(route.params.record.photoUris);

  return (
    <ScrollView style={styles.container}>
      <View style={{borderColor: "black", borderWidth: 1, borderRadius:2, margin: 2}}>
        <View style={{borderColor: "black", borderBottomWidth: 1, backgroundColor: "lightblue"}}>
          <Text style={{textAlign: "center"}}>Data Sheet</Text>
        </View>
        <Text>{`Date: ${date.slice(0, 10)}`}</Text>
        <Text>{`Type: ${type}`}</Text>
        <Text>{`Name: ${name}`}</Text>
        {!!organization && <Text>{`Organization: ${organization}`}</Text>}
        <Text>{`Location: ${latitude}, ${longitude}`}</Text>
        {!!tubeId && <Text>{`TubeId: ${tubeId}`}</Text>}
        {!!locationDescription && <Text>{`Description: ${locationDescription}`}</Text>}
        {!!notes && <Text>{`Additional Notes: ${notes}`}</Text>}
      </View>
      {photoUris.length > 0 && 
      <View style={{borderColor: "black", borderWidth: 1, margin:2}}>
        <View style={{borderColor: "black", borderBottomWidth: 1, borderRadius:2, backgroundColor: "lightblue"}}>
          <Text style={{textAlign: "center"}}>Photos</Text>
        </View>
        <View style={{flex:photoUris.length, flexDirection: "column"}}>
          {photoUris.map((x, index) => 
            <View style={{flex:1, borderBottomWidth:1, borderColor: "black"}} key={index}>
              <Image style={{width: "100%", height: 300}} key={index} source={{uri: downloadPhotoUri(x)}}/>
            </View>)}
        </View>
      </View>}
    </ScrollView>
  );
}

RecordDetailsScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

export { RecordDetailsScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});