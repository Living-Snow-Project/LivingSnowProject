import React from 'react';
import { Image, Pressable, View } from 'react-native';
import PropTypes from 'prop-types';
import { PictureIcon } from '../components/TabBarIcon';

const PhotoControl = ({navigation, photos}) => {
  return (
    <Pressable onPress={() => navigation.navigate(`Images`)}>
      {photos.length === 0 && <PictureIcon/>}
      {photos.length > 0 && 
      <View style={{flex:photos.length, flexDirection: "row"}}>{
        photos.map((x, index) =>
        <View style={{flex:1, margin:3}} key={index}>
          <Image style={{width: "100%", height: 100}} key={index} source={{uri: x.uri}}/>
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

export { PhotoControl };