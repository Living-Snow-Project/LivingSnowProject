import React, { useContext } from "react";
import { Switch, Text, View } from "react-native";
import styles from "../styles/Settings";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import { AppSettingsContext } from "../../AppSettings";

// TODO: add a local state of AppSettings
// subscribe to react navigation "beforeRemove" event, and update the AppSettingsContext at this time (to minimize re-renders)
// ideally UserIdentityInput would do that same thing
// consider putting AppSettingsContext in useMemo or useRef
// consider custom hook for AppSettingsContext, ie. useAppSettings
// the problem is every time "updateAppSettings" is called, it updates the Context and causes re-renders to every subscriber of Context
export default function SettingsScreen() {
  const {
    showGpsWarning,
    showAtlasRecords,
    showOnlyAtlasRecords,
    updateAppSettings,
  } = useContext(AppSettingsContext);
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
          onValueChange={(value) =>
            updateAppSettings({ showGpsWarning: value })
          }
          value={showGpsWarning}
        />
      </View>

      <Text style={styles.optionStaticText}>Snow Algae Atlas</Text>
      <View style={styles.optionContainer}>
        <Text style={styles.optionStaticText}>Show Atlas Records</Text>
        <Switch
          style={styles.switch}
          disabled={showOnlyAtlasRecords}
          onValueChange={(value) =>
            updateAppSettings({ showAtlasRecords: value })
          }
          value={showAtlasRecords}
        />
      </View>
      <View style={[styles.optionContainer, { marginTop: 5 }]}>
        <Text style={styles.optionStaticText}>Show Only Atlas Records</Text>
        <Switch
          style={styles.switch}
          disabled={!showAtlasRecords}
          onValueChange={(value) =>
            updateAppSettings({ showOnlyAtlasRecords: value })
          }
          value={showOnlyAtlasRecords}
        />
      </View>
    </View>
  );
}
