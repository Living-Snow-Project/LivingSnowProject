import React, { useState } from "react";
import { View } from "react-native";
import { FormControl, Input, Pressable, useColorModeValue } from "native-base";
import { Calendar } from "react-native-calendars";
import { Labels } from "../../constants";

type DateSelectorProps = {
  date: string;
  maxDate: string;
  setDate: (date: string) => void;
};

const dark = "#44403c"; // NativeBase light.700
const light = "#fafaf9"; // NativeBase light.50

export function DateSelector({ date, maxDate, setDate }: DateSelectorProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const bgColor = useColorModeValue(light, dark);
  const dayColor = useColorModeValue(dark, light);
  const selectedDayColor = bgColor;
  const monthColor = dayColor;
  const disabledColor = useColorModeValue(`${dark}55`, `${light}55`);

  const renderCalendar = () => {
    if (calendarVisible) {
      return (
        <Calendar
          testID="calendar"
          current={date}
          onDayPress={(newDate) => {
            setCalendarVisible(false);
            setDate(newDate.dateString);
          }}
          maxDate={maxDate}
          markedDates={{ [date]: { selected: true } }}
          theme={{
            calendarBackground: bgColor,
            dayTextColor: dayColor,
            selectedDayTextColor: selectedDayColor,
            monthTextColor: monthColor,
            textDisabledColor: disabledColor,
          }}
        />
      );
    }

    return (
      <View pointerEvents="none">
        <Input value={date} size="lg" />
      </View>
    );
  };

  return (
    <FormControl isRequired>
      <FormControl.Label>{Labels.Date}</FormControl.Label>
      <Pressable
        testID="calendar-pressable"
        onPress={() => setCalendarVisible(true)}
      >
        {renderCalendar()}
      </Pressable>
    </FormControl>
  );
}
