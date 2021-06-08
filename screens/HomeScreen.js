import React, { useState, useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Network } from '../lib/Network';
import { RecordManager } from '../lib/RecordManager';
import { TimelineRow } from '../components/TimelineRow';

//
// TODO: rename file
// TODO?: Separate out the render code into a View file
//

function TimelineScreen({navigation}) {
  const [records, setRecords] = useState([]);

  // TODO?: is this better accomplished with "React Query" (since fetching and refreshing are similar)
  let fetching = false;
  const [refreshing, setRefreshing] = useState(false);

  const handleNetworkActivity = () => {
    if (fetching) {
      return;
    }

    fetching = true;
    setRefreshing(true);

    RecordManager.retryRecords()
    .then(() => RecordManager.retryPhotos())
    .then(() => Network.downloadRecords())
    .then(response => setRecords(response))
    .catch(() => Alert.alert(`Download failed`, `Could not download records. Please try again later.`))
    .finally(() => {
      fetching = false;
      setRefreshing(false);
    });
  }

  // TODO?: React Hooks documentation hinted there might be a better way to implement one-time useEffect calls
  useEffect(handleNetworkActivity, []);

  const renderRecords = () => {
    let display = (<Text style={styles.noRecords}>No records to display</Text>);

    if (records.length > 0) {
      display = records.map((record, index) => (<TimelineRow key={index} navigation={navigation} record={record} />))
    }

    return display;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleNetworkActivity}/>}
      >
        {renderRecords()}
      </ScrollView>
    </View>
  );
}

TimelineScreen.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  noRecords: {
    textAlign: 'center',
    marginTop: 20
  },
});

export { TimelineScreen };