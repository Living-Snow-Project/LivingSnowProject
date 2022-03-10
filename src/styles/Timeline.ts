import { StyleSheet } from "react-native";

const TimelineStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noRecords: {
    textAlign: "center",
    marginTop: 20,
  },
  recordStatusContainer: {
    backgroundColor: "lightgrey",
    borderBottomWidth: 1,
  },
  recordStatusText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default TimelineStyles;
