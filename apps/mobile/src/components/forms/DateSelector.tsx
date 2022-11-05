import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import PropTypes from "prop-types";
import { Calendar } from "react-native-calendars";
import { formInputStyles } from "../../styles/FormInput";

export default function DateSelector({ date, setDate }) {
  const [calendarVisible, setCalendarVisible] = useState(false);

  const textInputProps = {
    style: formInputStyles.optionInputText,
    value: date,
  };

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Date</Text>
      <Pressable
        testID="calendar-pressable"
        onPress={() => setCalendarVisible(true)}
      >
        {calendarVisible && (
          <Calendar
            testID="calendar"
            current={date}
            onDayPress={(newDate) => {
              setCalendarVisible(false);
              setDate(newDate.dateString);
            }}
            markedDates={{ [date]: { selected: true } }}
          />
        )}
        {!calendarVisible && (
          <View pointerEvents="none">
            <TextInput {...textInputProps} />
          </View>
        )}
      </Pressable>
    </>
  );
}

DateSelector.propTypes = {
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
};
