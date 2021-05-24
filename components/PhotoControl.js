import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { PictureIcon } from '../components/TabBarIcon';
import { Routes } from '../navigation/Routes';

const PhotoControl = ({navigation, photos}) => {
  return (
    <Pressable onPress={() => navigation.navigate(Routes.ImagesPickerScreen)}>
      {photos.length === 0 && <PictureIcon/>}
      {photos.length > 0 && 
      <View style={{flex:photos.length, flexDirection: 'row'}}>{
        photos.map((x, index) =>
        <View style={styles.singlePhotoContainer} key={index}>
          <Image style={styles.photo} key={index} source={{uri: x.uri}}/>
        </View>)}
      </View>}
    </Pressable>
  );
}

PhotoControl.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  photos: PropTypes.array,
};

const styles = StyleSheet.create({
  // these styles could be dynamically sized\arranged based on number of photos and combinaions of portrait\landscape
  singlePhotoContainer: {
    flex:1,
    margin:1,
    height: 100
  },
  photo: {
    width: '100%',
    height: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 2
  }
});

export { PhotoControl };