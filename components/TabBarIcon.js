import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';

export class StockIcon extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    style: PropTypes.object,
    color: PropTypes.string
  }
  
  render() {
    const {name, size, style, color } = this.props;
    return (      
      <Icon.Ionicons
        name={name}
        size={size ? size : 32}
        style={style}
        color={color ? color : Colors.tabIconDefault}
      />
    );
  }
}

export class RecordIcon extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired
  }
  
  render() {
    var name = Platform.OS === 'ios' ? 'ios-eye' : 'md-eye';
    var color = 'skyblue';

    if (this.props.type === "Sample") {
      name = Platform.OS === 'ios' ? 'ios-flask' : 'md-flask';
      color = 'lightcoral';
    }

    return (
      <StockIcon
        name={name}
        size={48}
        color={color}
      />
    );
  }
}