import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { AssetsSelector } from 'expo-images-picker';
import { Ionicons } from '@expo/vector-icons';

function ImagesPickerScreen(props) {
  let {navigation } = props;
  return (
    <AssetsSelector
      options={{
        manipulate: {
          compress: 0.7,
          base64: false,
          saveTo: 'jpeg',
        },
        assetsType: ['photo'],
        maxSelections: 3,
        margin: 3,
        portraitCols: 4,
        landscapeCols: 5,
        widgetWidth: 100,
        widgetBgColor: 'white',
        selectedBgColor: 'red',
        spinnerColor: 'blue',
        videoIcon: {
          Component: Ionicons,
          iconName: 'ios-videocam',
          color: 'white',
          size: 20,
        },
        selectedIcon: {
          Component: Ionicons,
          iconName: 'ios-checkmark-circle-outline',
          color: 'white',
          bg: 'white',
          size: 20,
        },
        defaultTopNavigator: {
          continueText: 'Finish',
          goBackText: 'Back',
          //buttonStyle: validViewStyleObject,
          //textStyle: validTextStyleObject,
          backFunction: navigation.goBack,
          doneFunction: (data) => navigation.navigate('Record', {data: data}),
        },
        noAssets: {
          Component: Text,
        },
      }}
    />
  );
}

ImagesPickerScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
}

export { ImagesPickerScreen };
