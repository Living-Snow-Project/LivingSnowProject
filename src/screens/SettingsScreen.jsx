import React from "react";
import { Switch, Text, TextInput, View } from "react-native";
import Storage from "../lib/Storage";
import styles from "../styles/Settings";

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings",
    headerTitleContainerStyle: { justifyContent: "center" },
  };

  toggleShowGpsWarning(value) {
    global.appConfig.showGpsWarning = value;
    Storage.saveAppConfig();
    this.forceUpdate();
  }

  toggleShowAtlasRecords(value) {
    global.appConfig.showAtlasRecords = value;
    Storage.saveAppConfig();
    this.forceUpdate();
  }

  toggleShowOnlyAtlasRecords(value) {
    global.appConfig.showOnlyAtlasRecords = value;
    Storage.saveAppConfig();
    this.forceUpdate();
  }

  updateName(name) {
    global.appConfig.name = name;
    Storage.saveAppConfig();
    this.forceUpdate();
  }

  updateOrganization(organization) {
    global.appConfig.organization = organization;
    Storage.saveAppConfig();
    this.forceUpdate();
  }

  render() {
    return (
      <View>
        <Text style={styles.optionStaticText}>Name</Text>
        <TextInput
          style={styles.optionInputText}
          value={global.appConfig.name}
          onChangeText={(name) => this.updateName(name)}
          maxLength={50}
          returnKeyType="done"
        />

        <Text style={styles.optionStaticText}>Organization</Text>
        <TextInput
          style={styles.optionInputText}
          value={global.appConfig.organization}
          onChangeText={(organization) => this.updateOrganization(organization)}
          maxLength={50}
          returnKeyType="done"
        />

        <Text style={styles.optionStaticText}>Notifications</Text>
        <View style={styles.optionContainer}>
          <Text style={styles.optionStaticText}>
            Show Manual Coordinates Warning
          </Text>
          <Switch
            style={styles.switch}
            onValueChange={(value) => this.toggleShowGpsWarning(value)}
            value={global.appConfig.showGpsWarning}
          />
        </View>

        <Text style={styles.optionStaticText}>Snow Algae Atlas</Text>
        <View style={styles.optionContainer}>
          <Text style={styles.optionStaticText}>Show Atlas Records</Text>
          <Switch
            style={styles.switch}
            disabled={global.appConfig.showOnlyAtlasRecords}
            onValueChange={(value) => this.toggleShowAtlasRecords(value)}
            value={global.appConfig.showAtlasRecords}
          />
        </View>
        <View style={[styles.optionContainer, { marginTop: 5 }]}>
          <Text style={styles.optionStaticText}>Show Only Atlas Records</Text>
          <Switch
            style={styles.switch}
            disabled={!global.appConfig.showAtlasRecords}
            onValueChange={(value) => this.toggleShowOnlyAtlasRecords(value)}
            value={global.appConfig.showOnlyAtlasRecords}
          />
        </View>
      </View>
    );
  }
}
