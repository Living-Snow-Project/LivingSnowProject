import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Logger from "../lib/Logger";
import StatusBar from "../components/StatusBar";
import { ExampleRecordList } from "../components/RecordList";
import styles from "../styles/Timeline";
import TestIds from "../constants/TestIds";
import {
  RecordReducerActionsContext,
  RecordReducerStateContext,
} from "../hooks/useRecordReducer";
import useRecordList from "../hooks/useRecordList";
import PressableOpacity from "../components/PressableOpacity";
import { ScrollTopIcon } from "../components/Icons";

function Separator() {
  return <View style={styles.separator} />;
}

type ContainerDimensions = {
  width: number;
  height: number;
};

export default function TimelineScreen({ navigation }) {
  const scrollViewRef = useRef<FlatList>(null);
  const [containerDims, setContainerDims] = useState<ContainerDimensions>({
    width: 0,
    height: 0,
  });
  const [scrollingToTop, setScrollingToTop] = useState<boolean>(false);
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  const recordList = useRecordList(navigation);
  const [connected, setConnected] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const recordReducerActionsContext = useContext(RecordReducerActionsContext);
  const recordReducerStateContext = useContext(RecordReducerStateContext);

  // TODO: should be in App component and in a Reducer\Context
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

  useEffect(() => {
    if (!refreshing) {
      return;
    }

    if (!connected) {
      setRefreshing(false);
      return;
    }

    recordReducerActionsContext
      .retryPendingRecords()
      .then(() => recordReducerActionsContext.downloadRecords())
      .catch(() =>
        Logger.Warn(`Could not download records. Please try again later.`)
      )
      .finally(() => setRefreshing(false));
  }, [refreshing]);

  return (
    <>
      <View
        style={styles.container}
        onLayout={({ nativeEvent }) => setContainerDims(nativeEvent.layout)}
      >
        <StatusBar
          state={recordReducerStateContext.state}
          isConnected={connected}
        />
        <FlatList
          ref={scrollViewRef}
          data={recordList}
          testID={TestIds.TimelineScreen.FlatList}
          renderItem={({ item }) => item}
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={ExampleRecordList}
          ItemSeparatorComponent={Separator}
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y < 1000) {
              setScrollingToTop(false);
            }
            setShowScrollToTop(nativeEvent.contentOffset.y > 1000);
          }}
          onRefresh={() => setRefreshing(true)}
          refreshing={false} // StatusBar component handles activity indicator
          onEndReached={() => {
            // keep an eye on this (if list is "empty" and it gets called)
            const { downloadedRecords } = recordReducerStateContext;
            recordReducerActionsContext.downloadNextRecords(
              downloadedRecords[downloadedRecords.length - 1].date
            );
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
      {showScrollToTop && !scrollingToTop && (
        <View
          style={[
            styles.scrollToTop,
            {
              top: containerDims.height - 65,
              left: containerDims.width / 2 - 25,
            },
          ]}
        >
          <PressableOpacity
            testID={TestIds.TimelineScreen.ScrollToTopButton}
            onPress={() => {
              setScrollingToTop(true);
              scrollViewRef?.current?.scrollToOffset({
                animated: true,
                offset: 0,
              });
            }}
          >
            <ScrollTopIcon />
          </PressableOpacity>
        </View>
      )}
    </>
  );
}
