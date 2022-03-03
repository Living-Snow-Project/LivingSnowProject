import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { loadRecords } from "../lib/Storage";
import { downloadRecords } from "../lib/Network";
import { retryRecords } from "../lib/RecordManager";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { isAtlas } from "../record/Record";
import styles from "../styles/Timeline";
import { getAppSettings } from "../../AppSettings";
import RecordList from "../components/RecordList";
import { Labels } from "../constants/Strings";
import TestIds from "../constants/TestIds";

export default function TimelineScreen({ navigation }) {
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pendingRecords, setPendingRecords] = useState<AlgaeRecord[]>([]);
  const [downloadedRecords, setDownloadedRecords] = useState<AlgaeRecord[]>([]);
  const [showAtlasRecords, setShowAtlasRecords] = useState<boolean>(
    getAppSettings().showAtlasRecords
  );
  const [showOnlyAtlasRecords, setShowOnlyAtlasRecords] = useState<boolean>(
    getAppSettings().showOnlyAtlasRecords
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      setConnected(!!isConnected);

      if (isConnected) {
        setRefreshing(true);
      }
    });

    return unsubscribe;
  }, []);

  const displaySavedRecords = () =>
    loadRecords().then((records) => setPendingRecords(records));
  // re-render when user comes back from Settings screen
  useEffect(() =>
    navigation.addListener("focus", () => {
      displaySavedRecords();
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

    retryRecords()
      .then(() => downloadRecords())
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
    (record: AlgaeRecord) => {
      const atlas = isAtlas(record.type);
      return (atlas && !showAtlasRecords) || (!atlas && showOnlyAtlasRecords);
    },
    [showAtlasRecords, showOnlyAtlasRecords]
  );

  return (
    <View style={styles.container}>
      <StatusBar isConnected={connected} />
      <ScrollView
        style={styles.container}
        testID={TestIds.TimelineScreen.RefreshControl}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        {pendingRecords.length === 0 && downloadedRecords.length === 0 && (
          <Text style={styles.noRecords}>
            {Labels.TimelineScreen.NoRecords}
          </Text>
        )}

        <RecordList
          records={pendingRecords}
          header={Labels.TimelineScreen.PendingRecords}
        />

        <RecordList
          records={downloadedRecords}
          header={Labels.TimelineScreen.DownloadedRecords}
          omitRecord={omitRecord}
        />
      </ScrollView>
    </View>
  );
}
