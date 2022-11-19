import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { formInputStyles } from "../../styles/FormInput";

type DateSelectorProps = {
  date: string;
  setDate: (date: string) => void;
};

export default function DateSelector({ date, setDate }: DateSelectorProps) {
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
