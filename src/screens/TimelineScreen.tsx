import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Storage from "../lib/Storage";
import { Network } from "../lib/Network";
import RecordManager from "../lib/RecordManager";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { Record, isAtlas } from "../record/Record";
import styles from "../styles/Timeline";
import { getAppSettings } from "../../AppSettings";
import RecordList from "../components/RecordList";

export default function TimelineScreen({ navigation }) {
  const [connected, setConnected] = useState<boolean | null>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingRecords, setPendingRecords] = useState<Record[]>([]);
  const [downloadedRecords, setDownloadedRecords] = useState<Record[]>([]);
  const [status, setStatus] = useState({
    text: null,
    type: null,
    onDone: null,
  });
  const [showAtlasRecords, setShowAtlasRecords] = useState(
    getAppSettings().showAtlasRecords
  );
  const [showOnlyAtlasRecords, setShowOnlyAtlasRecords] = useState(
    getAppSettings().showOnlyAtlasRecords
  );

  const updateStatus = (text, type, onDone = null) =>
    setStatus({ text, type, onDone });
  const clearStatus = () => updateStatus(null, null, null);

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
        /* eslint-disable no-param-reassign */
        records[index].photoUris = record.photoUris.reduce(
          (accumulator, photo) => `${accumulator}${photo.uri};`,
          ``
        );
      });
      setPendingRecords(records);
    });
  }, []);

  // re-render when user comes back from Settings screen
  useEffect(() =>
    navigation.addListener("focus", () => {
      setShowAtlasRecords(getAppSettings().showAtlasRecords);
      setShowOnlyAtlasRecords(getAppSettings().showOnlyAtlasRecords);
    })
  );

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
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => {
        setRefreshing(false);
        displaySavedRecords();
      });
  }, [refreshing]);

  const omitRecord = useCallback(
    (record) => {
      // BUGBUG: because legacy type = string, but we will change to enum and break old clients :)
      const atlas = isAtlas(record.type);
      return (atlas && !showAtlasRecords) || (!atlas && showOnlyAtlasRecords);
    },
    [showAtlasRecords, showOnlyAtlasRecords]
  );

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

        <RecordList records={pendingRecords} header="Pending" />

        <RecordList
          records={downloadedRecords}
          header="Downloaded"
          omitRecord={omitRecord}
        />
      </ScrollView>
    </View>
  );
}