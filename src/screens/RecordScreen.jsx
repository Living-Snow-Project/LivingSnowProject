import React from "react";
import PropTypes from "prop-types";
import RecordView from "../views/RecordView";

export default class RecordScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  render() {
    return <RecordView navigation={this.props.navigation} />;
  }
}
