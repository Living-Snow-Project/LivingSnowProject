import React from 'react';
import { Platform } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';
import RecordView from '../views/RecordView';
import { StockIcon } from '../components/TabBarIcon';

export default class RecordScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const headerRight = (
      <Touchable onPress={() => navigation.state.params.handleUpload()}>
        <StockIcon name={Platform.OS === 'ios' ? 'ios-cloud-upload' : 'md-cloud-upload'} />
      </Touchable>
    );

    return {
      title: 'Record',
      headerTitleContainerStyle: { justifyContent: 'center' },
      headerRight: () => headerRight,
      headerRightContainerStyle: { marginRight: 20 },
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <RecordView navigation={navigation} />
    );
  }
}
