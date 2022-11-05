import { StyleSheet } from "react-native";

export const formInputStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 1,
    paddingHorizontal: 10,
  },
  optionStaticText: {
    fontSize: 15,
    marginTop: 3,
  },
  optionInputText: {
    backgroundColor: "#efefef",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    minHeight: "8%",
  },
  multilineTextInput: {
    paddingTop: 15,
  },
});

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: formInputStyles.optionInputText,
  inputAndroid: formInputStyles.optionInputText,
});
