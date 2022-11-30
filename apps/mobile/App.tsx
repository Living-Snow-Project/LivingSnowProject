import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import Navigation from "./src/navigation/MainTabNavigator";
import useCachedResources from "./src/hooks/useCachedResources";
import {
  useAlgaeRecords,
  RecordReducerStateContext,
  AlgaeRecordsContext,
} from "./src/hooks/useAlgaeRecords";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [storageState, algaeRecords] = useAlgaeRecords();

  if (storageState.state !== "Seeding" && !storageState.seeded) {
    algaeRecords.seed();
  }

  if (!isLoadingComplete || !storageState.seeded) {
    return null;
  }

  return (
    <RecordReducerStateContext.Provider value={storageState}>
      <AlgaeRecordsContext.Provider value={algaeRecords}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </AlgaeRecordsContext.Provider>
    </RecordReducerStateContext.Provider>
  );
}
