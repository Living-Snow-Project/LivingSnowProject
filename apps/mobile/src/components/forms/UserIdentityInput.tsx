import React, { useState, useRef } from "react";
import { Text, TextInput } from "react-native";
import styles from "../../styles/Settings";
import { getAppSettings, setAppSettings } from "../../../AppSettings";
import { Placeholders } from "../../constants/Strings";

export default function UserIdentityInput() {
  const [{ name, organization }, setSettings] = useState<AppSettings>(
    getAppSettings()
  );
  const orgRef = useRef<TextInput>(null);

  return (
    <>
      <Text style={styles.optionStaticText}>Name</Text>
      <TextInput
        style={styles.optionInputText}
        value={name}
        placeholder={Placeholders.Settings.Username}
        onChangeText={(value) => {
          setSettings((prev) => {
            setAppSettings({ ...prev, name: value });
            return { ...prev, name: value };
          });
        }}
        onSubmitEditing={() => orgRef.current?.focus()}
        maxLength={50}
        returnKeyType="done"
      />

      <Text style={styles.optionStaticText}>Organization</Text>
      <TextInput
        ref={orgRef}
        style={styles.optionInputText}
        value={organization}
        placeholder={Placeholders.Settings.Organization}
        onChangeText={(value) => {
          setSettings((prev) => {
            setAppSettings({ ...prev, organization: value });
            return { ...prev, organization: value };
          });
        }}
        maxLength={50}
        returnKeyType="done"
      />
    </>
  );
}
