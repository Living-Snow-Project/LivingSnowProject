import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import Navigation from "./src/navigation/MainTabNavigator";
import useCachedResources from "./src/hooks/useCachedResources";
import {
  useRecordReducer,
  RecordReducerStateContext,
  RecordReducerActionsContext,
} from "./src/hooks/useRecordReducer";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [storageState, storageActions] = useRecordReducer();

  if (storageState.state !== "Seeding" && !storageState.seeded) {
    storageActions.seed();
  }

  if (!isLoadingComplete || !storageState.seeded) {
    return null;
  }

  return (
    <RecordReducerStateContext.Provider value={storageState}>
      <RecordReducerActionsContext.Provider value={storageActions}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </RecordReducerActionsContext.Provider>
    </RecordReducerStateContext.Provider>
  );
}
