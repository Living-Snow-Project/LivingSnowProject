import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import Storage from "../lib/Storage";
import { Network } from "../lib/Network";
import RecordManager from "../lib/RecordManager";
import TimelineRow from "../components/TimelineRow";
import StatusBar from "../components/StatusBar";

export default function TimelineScreen({ navigation }) {
  const [connected, setConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingRecords, setPendingRecords] = useState([]);
  const [downloadedRecords, setDownloadedRecords] = useState([]);
  const [status, setStatus] = useState({
    text: null,
    type: null,
    onDone: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      setConnected(isConnected);

      if (isConnected) {
        clearStatus();
        setRefreshing(true);
      } else {
        updateStatus(`No Internet Connection`, `static`, null);
      }
    });

    return unsubscribe;
  }, []);

  const displaySavedRecords = useCallback(() => {
    // records.photoUris is saved on disk as array of {uri, width, height} but RecordDetailsScreen expects `uri;uri;...` string format
    Storage.loadRecords().then((records) => {
      records.forEach((record, index) => {
        records[index].photoUris = record.photoUris.reduce(
          (accumulator, photo) => `${accumulator}${photo.uri};`,
          ``
        );
      });
      setPendingRecords(records);
    });
  }, []);

  // force a re-render when user comes back from Settings screen
  // TODO: figure out why this is getting called on blur too
  useFocusEffect(displaySavedRecords);

  useEffect(() => {
    if (!refreshing) {
      return;
    }

    if (!connected) {
      setRefreshing(false);
      return;
    }

    RecordManager.retryRecords()
      .then(() => RecordManager.retryPhotos())
      .then(() => Network.downloadRecords())
      .then((response) => setDownloadedRecords(response))
      .catch(() =>
        console.log(`Could not download records. Please try again later.`)
      )
      .finally(() => {
        setRefreshing(false);
        displaySavedRecords();
      });
  }, [refreshing]);

  const renderRecords = useCallback((records, label) => {
    if (records.length === 0) {
      return null;
    }

    return (
      <View>
        <View style={styles.recordStatusContainer}>
          <Text style={styles.recordStatusText}>{label}</Text>
        </View>
        {records.map((record, index) => (
          <TimelineRow
            key={index}
            navigation={navigation}
            record={record}
            showAll={label.includes(`Pending`)}
          />
        ))}
      </View>
    );
  }, []);

  const updateStatus = (text, type, onDone = null) =>
    setStatus({ text, type, onDone });
  const clearStatus = () => updateStatus(null, null, null);

  return (
    <View style={styles.container}>
      <StatusBar text={status.text} type={status.type} onDone={status.onDone} />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        {pendingRecords.length === 0 && downloadedRecords.length === 0 && (
          <Text style={styles.noRecords}>No records to display</Text>
        )}
        {renderRecords(pendingRecords, `Pending`)}
        {renderRecords(downloadedRecords, `Downloaded`)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  noRecords: {
    textAlign: "center",
    marginTop: 20,
  },
  recordStatusContainer: {
    backgroundColor: "lightgrey",
    borderBottomWidth: 1,
  },
  recordStatusText: {
    fontSize: 16,
    textAlign: "center",
  },
});
