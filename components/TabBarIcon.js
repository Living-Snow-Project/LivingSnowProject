import React from 'react';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={this.props.style}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}

export class PictureIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={Platform.OS === 'ios' ? 'ios-image' : 'md-image'}
        size={48}
        style={this.props.style}
        color={Colors.tabIconDefault}
      />
    );
  }
}

export class RecordIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: undefined,
      color: undefined
    };

    if (props.type === "Sample") {
      this.state.icon = Platform.OS === 'ios' ? 'ios-flask' : 'md-flask';
      this.state.color = 'lightcoral';
    } else {
      this.state.icon = Platform.OS === 'ios' ? 'ios-eye' : 'md-eye' ;
      this.state.color = 'lightblue';
    }
  }

  render() {
    return (
      <Icon.Ionicons
        name={this.state.icon}
        size={48}
        style={this.props.style}
        color={this.state.color}
      />
    );
  }
}

/*export class FeedBarIcon extends React.Component {
  render() {
    return (
      <Image
        source={require('../node_modules/@expo/samples/assets/images/expo-icon.png')}
        fadeDuration={0}
        style={{ width: 25, height: 20 }}
      />
    );
  }
}*/