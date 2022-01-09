import React, { useContext, useRef } from "react";
import { Text, TextInput } from "react-native";
import styles from "../../styles/Settings";
import { AppSettingsContext } from "../../../AppSettings";

export default function UserIdentityInput() {
  const { name, organization, updateAppSettings } =
    useContext(AppSettingsContext);
  const orgRef = useRef<TextInput>(null);

  return (
    <>
      <Text style={styles.optionStaticText}>Name</Text>
      <TextInput
        style={styles.optionInputText}
        value={name}
        placeholder="Enter your name"
        onChangeText={(value) => updateAppSettings({ name: value })}
        onSubmitEditing={() => orgRef.current?.focus()}
        maxLength={50}
        returnKeyType="done"
      />

      <Text style={styles.optionStaticText}>Organization</Text>
      <TextInput
        ref={orgRef}
        style={styles.optionInputText}
        value={organization}
        placeholder="Enter the organization you belong to (if any)"
        onChangeText={(value) => updateAppSettings({ organization: value })}
        maxLength={50}
        returnKeyType="done"
      />
    </>
  );
}
