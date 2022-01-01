import React from "react";
import RecordView from "../views/RecordView";

export default class RecordScreen extends React.Component {
  render() {
    return <RecordView navigation={this.props.navigation} />;
  }
}
