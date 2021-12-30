import React from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Storage } from "../lib/Storage";

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

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: "#efefef",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 10,
  },
  optionTextContainer: {
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  optionStaticText: {
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  optionInputText: {
    backgroundColor: "#efefef",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  switch: {
    marginRight: 10,
    borderColor: "black",
  },
});
