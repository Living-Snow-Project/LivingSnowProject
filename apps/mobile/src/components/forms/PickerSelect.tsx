import React, { useState } from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { XStack, Text, useTheme, Sheet, ScrollView } from "tamagui";

export type TamaguiPickerSelectProps = {
  placeholder: string;
  items: { label: string; value: string }[];
  value: string | null | undefined;
  onValueChange: (value: string) => void;
};

export function TamaguiPickerSelect({
  placeholder,
  items,
  value,
  onValueChange,
}: TamaguiPickerSelectProps) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const selectedLabel = items.find((item) => item.value === value)?.label;

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <XStack
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$3"
          paddingHorizontal="$3"
          paddingVertical="$2"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="$background"
        >
          <Text color={selectedLabel ? "$color" : "$placeholderColor"}>
            {selectedLabel ?? placeholder}
          </Text>
          <Ionicons name="chevron-down" size={16} color={theme.color.val} />
        </XStack>
      </Pressable>

      <Sheet modal open={open} onOpenChange={setOpen} dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame>
          <ScrollView>
            {items.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => {
                  onValueChange(item.value);
                  setOpen(false);
                }}
              >
                <XStack
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  alignItems="center"
                  justifyContent="space-between"
                  backgroundColor={value === item.value ? "$blue4" : undefined}
                >
                  <Text>{item.label}</Text>
                  {value === item.value && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={theme.blue10.val}
                    />
                  )}
                </XStack>
              </Pressable>
            ))}
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
