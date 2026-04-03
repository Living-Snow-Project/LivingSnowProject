import React, { createContext, useRef, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, XStack, YStack, useTheme } from "tamagui";

export type ToastAlertProps = {
  status: "success" | "info";
  title: string;
  message?: string;
};

export function ToastAlert({ status, title, message }: ToastAlertProps) {
  const theme = useTheme();
  const isSuccess = status === "success";
  const bgColor = isSuccess ? theme.green3.val : theme.blue3.val;
  const iconColor = isSuccess ? theme.green9.val : theme.blue9.val;

  return (
    <XStack
      maxWidth="90%"
      alignSelf="center"
      backgroundColor={bgColor}
      borderRadius="$2"
      padding="$3"
      gap="$2"
      alignItems="flex-start"
    >
      <Ionicons
        name={isSuccess ? "checkmark-circle" : "information-circle"}
        size={20}
        color={iconColor}
      />
      <YStack flex={1} gap="$1">
        <Text fontSize="$4" fontWeight="500" flexShrink={1}>
          {title}
        </Text>
        {message && (
          <Text fontSize="$3" flexShrink={1}>
            {message}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}

type ToastContextValue = {
  show: (component: JSX.Element) => void;
};

export const ToastContext = createContext<ToastContextValue>({
  show: () => {},
});

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<JSX.Element | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (component: JSX.Element) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(component);
    timerRef.current = setTimeout(() => setToast(null), 2000);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 9999,
          }}
          pointerEvents="none"
        >
          {toast}
        </View>
      )}
    </ToastContext.Provider>
  );
}