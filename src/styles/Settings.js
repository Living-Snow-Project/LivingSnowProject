import { StyleSheet } from "react-native";

const SettingsStyles = StyleSheet.create({
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

export default SettingsStyles;
