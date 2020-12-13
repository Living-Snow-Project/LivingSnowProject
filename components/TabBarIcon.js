import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    const {name, size, style, focused } = this.props;
    return (      
      <Icon.Ionicons
        name={name}
        size={size ? size : 26}
        style={style}
        color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object.isRequired,
  focused: PropTypes.bool,
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
      name: '',
      color: '',
    }

    if (props.type === "Sample") {
      this.state.name = Platform.OS === 'ios' ? 'ios-flask' : 'md-flask';
      this.state.color = 'lightcoral';
    } else {
      this.state.name = Platform.OS === 'ios' ? 'ios-eye' : 'md-eye' ;
      this.state.color = 'lightblue';
    }
  }

  render() {
    const {name, color} = this.state;
    return (
      <Icon.Ionicons
        name={name}
        size={48}
        style={this.props.style}
        color={color}
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