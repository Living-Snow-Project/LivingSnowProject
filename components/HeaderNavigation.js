import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import TabBarIcon from '../components/TabBarIcon';

export default class HeaderNavigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate(this.props.nextScreen)} activeOpacity={0.4}>
          <View>
            <TabBarIcon name={Platform.OS === 'ios' ? this.props.iosImage : this.props.androidImage}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}