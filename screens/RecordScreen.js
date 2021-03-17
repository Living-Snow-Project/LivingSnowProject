import React from 'react';
import PropTypes from 'prop-types';
import { RecordView } from '../views/RecordView';

export default class RecordScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object,
  }

  render() {
    return (
      <RecordView navigation={this.props.navigation} route={this.props.route}/>
    );
  }
}
