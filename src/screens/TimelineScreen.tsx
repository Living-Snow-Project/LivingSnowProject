import React, { useCallback, useContext, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { saveCachedRecords } from "../lib/Storage";
import { downloadRecords } from "../lib/Network";
import { retryRecords } from "../lib/RecordManager";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { isAtlas, productionExampleRecord } from "../record/Record";
import styles from "../styles/Timeline";
import { getAppSettings } from "../../AppSettings";
import { RecordList, PendingRecordList } from "../components/RecordList";
import { Labels } from "../constants/Strings";
import TestIds from "../constants/TestIds";
import { RecordReducerStateContext } from "../hooks/useRecordReducer";

export default function TimelineScreen({ navigation }) {
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // BUGBUG: note that "pendingPhotos" is not considered\communicated to UX...
  const recordReducerStateContext = useContext(RecordReducerStateContext);
  const [downloadedRecords, setDownloadedRecords] = useState<AlgaeRecord[]>([]);
  const [showAtlasRecords, setShowAtlasRecords] = useState<boolean>(
    getAppSettings().showAtlasRecords
  );
  const [showOnlyAtlasRecords, setShowOnlyAtlasRecords] = useState<boolean>(
    getAppSettings().showOnlyAtlasRecords
  );

  // TODO: this should be Context done during application startup
  useEffect(
    () =>
      NetInfo.addEventListener(({ isConnected }) => {
        setConnected(!!isConnected);

        if (isConnected) {
          setRefreshing(true);
        }
      }),
    []
  );

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

    retryRecords()
      .then(() => downloadRecords())
      .then((response) => {
        saveCachedRecords(response.slice(0, 20));
        setDownloadedRecords(response);
      })
      .catch(() =>
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => setRefreshing(false));
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
        {recordReducerStateContext.pendingRecords.length === 0 &&
          downloadedRecords.length === 0 && (
            <RecordList
              records={[productionExampleRecord()]}
              header={Labels.TimelineScreen.ExampleRecords}
              omitRecord={() => false}
            />
          )}

        <PendingRecordList />

        <RecordList
          records={downloadedRecords}
          header={Labels.TimelineScreen.DownloadedRecords}
          omitRecord={omitRecord}
        />
      </ScrollView>
    </View>
  );
}
