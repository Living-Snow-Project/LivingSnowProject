import React, { useState } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import PropTypes from "prop-types";
import { Calendar } from "react-native-calendars";
import { formInputStyles } from "../../styles/FormInput";

export default function DateSelector({ date, setDate }) {
  const [calendarVisible, setCalendarVisible] = useState(false);

  return (
    <>
      <Text style={formInputStyles.optionStaticText}>Date</Text>
      <TouchableHighlight onPress={() => setCalendarVisible(true)}>
        <View>
          {calendarVisible && (
            <Calendar
              current={date}
              onDayPress={(newDate) => {
                setCalendarVisible(false);
                setDate(newDate.dateString);
              }}
              markedDates={{ [date]: { selected: true } }}
            />
          )}
          {!calendarVisible && (
            <Text style={formInputStyles.optionInputText}>{date}</Text>
          )}
        </View>
      </TouchableHighlight>
    </>
  );
}

DateSelector.propTypes = {
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
};
