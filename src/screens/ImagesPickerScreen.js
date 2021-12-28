import React from 'react';
import { Platform, Text } from 'react-native';
import PropTypes from 'prop-types';
import { AssetsSelector } from '../../expo-images-picker/index';
import { Ionicons } from '@expo/vector-icons';

export const ImagesPickerScreen = ({navigation, route}) => {
  return (
    <AssetsSelector
      options={{
        manipulate: {
          compress: 0.4,
          width: 1024, // ideally this would be the size constraint on the largest axis
          base64: false,
          saveTo: 'jpeg',
        },
        assetsType: ['photo'],
        maxSelections: 4,
        margin: 3,
        portraitCols: 4,
        landscapeCols: 5,
        widgetWidth: 100,
        widgetBgColor: 'white',
        selectedBgColor: 'red',
        spinnerColor: 'blue',
        videoIcon: {
          Component: Ionicons,
          iconName: Platform.OS === 'ios' ? 'ios-videocam' : 'md-videocam',
          color: 'white',
          size: 20,
        },
        selectedIcon: {
          Component: Ionicons,
          iconName: Platform.OS === 'ios' ? 'ios-checkmark-circle-outline' : 'md-checkmark-circle-outline',
          color: 'grey',
          bg: 'lightgrey',
          size: 40,
        },
        defaultTopNavigator: {
          continueText: 'Finish',
          goBackText: null,
          //buttonStyle: {borderWidth:2, borderColor:'red'},
          textStyle: {fontSize: 15},
          backFunction: () => {},
          doneFunction: data => {
            route.params.onUpdatePhotos(data);
            navigation.goBack();
          },
        },
        noAssets: <Text>No Assets</Text>,
      }}
    />
  );
}

ImagesPickerScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
}
