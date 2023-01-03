import React from "react";
import { Alert, HStack, Text, VStack } from "native-base";

type ToastInfoProps = {
  status: "success" | "info";
  title: string;
  message?: string;
};

export function ToastAlert({ status, title, message }: ToastInfoProps) {
  const renderMessage = message ? (
    <Text px="6" color="darkText">
      {message}
    </Text>
  ) : null;

  return (
    <Alert
      maxWidth="90%"
      alignSelf="center"
      flexDirection="row"
      status={status}
      variant="subtle"
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color="darkText"
            >
              {title}
            </Text>
          </HStack>
        </HStack>
        {renderMessage}
      </VStack>
    </Alert>
  );
}
