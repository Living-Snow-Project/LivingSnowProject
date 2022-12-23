import { StyleSheet } from "react-native";

export const TimelineStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recordStatusContainer: {
    backgroundColor: "lightgrey",
  },
  recordStatusText: {
    fontSize: 16,
    textAlign: "center",
  },
  separator: {
    backgroundColor: "black",
    height: StyleSheet.hairlineWidth,
  },
  scrollToTop: {
    zIndex: 1,
    paddingLeft: 3,
    position: "absolute",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    backgroundColor: "lightgrey",
  },
});
