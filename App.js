import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './navigation/MainTabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';

global.appConfig = {
  name: '',
  organization: '',
  showFirstRun: true,
  showGpsWarning: true,
  showAtlasRecords: false,
  showOnlyAtlasRecords: false
}

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
