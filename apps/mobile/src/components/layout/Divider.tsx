import React from "react";
import { Box, Text, useColorModeValue } from "native-base";

type DividerProps = {
  text?: string;
};

export function Divider({ text }: DividerProps) {
  const bg = useColorModeValue("light.300", "black");
  const pending = useColorModeValue("yellow.300", "yellow.500");
  const downloaded = useColorModeValue("tertiary.400", "tertiary.600");
  const infoBg = text == "Pending" ? pending : downloaded;

  if (text) {
    return (
      <Box bgColor={infoBg} width="100%">
        <Text textAlign="center" fontWeight="semibold">
          {text}
        </Text>
      </Box>
    );
  }

  return <Box size={3} bgColor={bg} width="100%" />;
}
