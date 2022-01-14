import React, { useState } from "react";
import { Switch, Text, View } from "react-native";
import styles from "../styles/Settings";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import { getAppSettings, setAppSettings } from "../../AppSettings";

export default function SettingsScreen() {
  const [
    { showGpsWarning, showAtlasRecords, showOnlyAtlasRecords },
    setSettings,
  ] = useState(getAppSettings());

  return (
    <View>
      <UserIdentityInput />

      <Text style={styles.optionStaticText}>Notifications</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionStaticText}>
          Show Manual Coordinates Warning
        </Text>
        <Switch
          style={styles.switch}
          onValueChange={(value) => {
            setSettings((prev) => {
              setAppSettings({ ...prev, showGpsWarning: value });
              return { ...prev, showGpsWarning: value };
            });
          }}
          value={showGpsWarning}
        />
      </View>

      <Text style={styles.optionStaticText}>Snow Algae Atlas</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionStaticText}>Show Atlas Records</Text>
        <Switch
          style={styles.switch}
          disabled={showOnlyAtlasRecords}
          onValueChange={(value) => {
            setSettings((prev) => {
              setAppSettings({ ...prev, showAtlasRecords: value });
              return { ...prev, showAtlasRecords: value };
            });
          }}
          value={showAtlasRecords}
        />
      </View>
      <View style={[styles.optionContainer, { marginTop: 5 }]}>
        <Text style={styles.optionStaticText}>Show Only Atlas Records</Text>
        <Switch
          style={styles.switch}
          disabled={!showAtlasRecords}
          onValueChange={(value) => {
            setSettings((prev) => {
              setAppSettings({ ...prev, showOnlyAtlasRecords: value });
              return { ...prev, showOnlyAtlasRecords: value };
            });
          }}
          value={showOnlyAtlasRecords}
        />
      </View>
    </View>
  );
}
