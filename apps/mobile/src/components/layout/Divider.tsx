import React from "react";
import { Box, Text, useColorModeValue } from "native-base";

type DividerProps = {
  text?: string;
};

export function Divider({ text }: DividerProps) {
  const bg = useColorModeValue("light.300", "black");
  const infoBg = useColorModeValue("light.400", "dark.300");

  if (text) {
    return (
      <Box bgColor={infoBg} width="100%">
        <Text textAlign="center">{text}</Text>
      </Box>
    );
  }

  return <Box size={3} bgColor={bg} width="100%" />;
}
