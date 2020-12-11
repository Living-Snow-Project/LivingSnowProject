import React from 'react';
import { Platform } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import RecordView from '../views/RecordView';
import TabBarIcon from '../components/TabBarIcon';

export default class RecordScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    let headerRight =
      <Touchable onPress={() => navigation.state.params.handleUpload()}>
        <TabBarIcon name={Platform.OS === 'ios' ? 'ios-cloud-upload' : 'md-cloud-upload'}/>
      </Touchable>;

    return {
      title: 'Record',
      headerTitleContainerStyle: {justifyContent: 'center'},
      headerRight: () => headerRight,
      headerRightContainerStyle: {marginRight: 20}
    }
  }

  render() {
    return (
      <RecordView navigation={this.props.navigation}/>
    );
  }
}
