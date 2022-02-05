import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PressableOpacity from "../components/PressableOpacity";
import { SnowIcon } from "../components/Icons";
import { setAppSettings } from "../../AppSettings";
import UserIdentityInput from "../components/forms/UserIdentityInput";
import KeyboardShift from "../components/KeyboardShift";

const styles = StyleSheet.create({
  ftreContainer: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  exitContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 30,
  },
  exitButtonContainer: {
    backgroundColor: "lightpink",
    width: 200,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  exitButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 25,
    marginTop: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    color: "red",
    textAlign: "center",
  },
  snowLeft: { marginRight: 30 },
  snowRight: { marginLeft: 30 },
});

export default function FirstRunScreen({ navigation }) {
  return (
    <KeyboardShift>
      {() => (
        <ScrollView style={styles.ftreContainer}>
          <View style={styles.welcomeContainer}>
            <SnowIcon style={styles.snowLeft} />
            <Text style={styles.welcomeText}>Living Snow Project</Text>
            <SnowIcon style={styles.snowRight} />
          </View>

          <Text style={styles.descriptionText}>
            {"Enter your name and the organization you are associated with, or skip and remain anonymous." +
              " You can change these at any time in the Settings tab."}
          </Text>

          <UserIdentityInput />

          <View style={styles.exitContainer}>
            <PressableOpacity
              onPress={() => {
                setAppSettings((prev) => ({ ...prev, showFirstRun: false }));
                navigation.navigate("Timeline");
              }}
            >
              <View style={styles.exitButtonContainer}>
                <Text style={styles.exitButtonText}>
                  Let&apos;s get started!
                </Text>
              </View>
            </PressableOpacity>
          </View>
        </ScrollView>
      )}
    </KeyboardShift>
  );
}
