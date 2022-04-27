import React, { useState } from "react";
import { Switch, Text, View } from "react-native";
import styles from "../styles/Settings";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import { getAppSettings, setAppSettings } from "../../AppSettings";
import TestIds from "../constants/TestIds";

export default function SettingsScreen() {
  const [{ showGpsWarning }, setSettings] = useState(getAppSettings());

  return (
    <>
      <UserIdentityInput />

      <Text style={styles.optionStaticText}>Notifications</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionStaticText}>
          Show Manual Coordinates Warning
        </Text>
        <Switch
          testID={TestIds.SettingsScreen.ShowGpsWarning}
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
    </>
  );
}
