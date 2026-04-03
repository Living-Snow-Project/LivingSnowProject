import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input, useTheme } from "tamagui";
import { FormField, FormLabel } from "./FormField";
import { Calendar, DateData } from "react-native-calendars";
import { Labels } from "../../constants";

type DateSelectorProps = {
  date: string;
  maxDate: string;
  setDate: (date: string) => void;
};

export function DateSelector({ date, maxDate, setDate }: DateSelectorProps) {
  const [calendarVisible, setCalendarVisible] = useState(false);

  const theme = useTheme();
  const bgColor = theme.calendarBg.val;
  const dayColor = theme.calendarDay.val;
  const selectedDayColor = bgColor;
  const monthColor = dayColor;
  const disabledColor = theme.calendarDisabled.val;
  const arrowColor = theme.calendarArrow.val;

  const onDayPress = (newDate: DateData) => {
    setCalendarVisible(false);
    setDate(newDate.dateString);
  };

  const renderCalendar = () => {
    if (calendarVisible) {
      return (
        <Calendar
          testID="calendar"
          current={date}
          onDayPress={onDayPress}
          maxDate={maxDate}
          markedDates={{ [date]: { selected: true } }}
          renderArrow={(direction) =>
            direction == "left" ? (
              <Ionicons name="arrow-back" size={16} color={arrowColor} />
            ) : (
              <Ionicons name="arrow-forward" size={16} color={arrowColor} />
            )
          }
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
        <Input value={date} size="$4" />
      </View>
    );
  };

  return (
    <FormField isRequired id="date-selector">
      <FormLabel>{Labels.Date}</FormLabel>
      <Pressable
        testID="calendar-pressable"
        onPress={() => setCalendarVisible(true)}
      >
        {renderCalendar()}
      </Pressable>
    </FormField>
  );
}