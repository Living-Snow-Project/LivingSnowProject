import React, { useState, useEffect, useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import { Network } from '../lib/Network';
import { RecordManager } from '../lib/RecordManager';
import { TimelineRow } from '../components/TimelineRow';
import { StatusBar } from '../components/StatusBar';

// TODO: rename file
function TimelineScreen({navigation}) {
  const [records, setRecords] = useState([]);
  const [connected, setConnected] = useState(true);
  const [status, setStatus] = useState({text: null, type: null, onDone: null});

  const fetching = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const updateStatus = (text, type, onDone = null) => {
    setStatus({text: text, type: type, onDone: onDone});
  }
  
  const clearStatus = () => {
    updateStatus(null, null, null);
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({isConnected}) => {
      setConnected(isConnected);

      isConnected ? clearStatus() : updateStatus(`No Internet Connection`, `static`, null);
    });

    return () => unsubscribe()    
  }, []);

  const handleNetworkActivity = () => {
    if (!connected || fetching.current) {
      return;
    }

    setRefreshing(true);
    fetching.current = true;

    RecordManager.retryRecords()
    .then(() => RecordManager.retryPhotos())
    .then(() => Network.downloadRecords())
    .then(response => setRecords(response))
    .catch(() => console.log(`Could not download records. Please try again later.`))
    .finally(() => {
      setRefreshing(false);
      fetching.current = false;
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
      <StatusBar text={status.text} type={status.type} onDone={status.onDone}/>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleNetworkActivity}/>}>
        {renderRecords()}
      </ScrollView>
    </View>
  );
}

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

TimelineScreen.propTypes = {
  navigation: PropTypes.object
};

export { TimelineScreen };