import React from "react";
import { Text, View } from "tamagui";

type DividerProps = {
  text?: string;
};

export function Divider({ text }: DividerProps) {
  const infoBg = text === "Pending" ? "$pendingColor" : "$downloadedColor";

  if (text) {
    return (
      <View backgroundColor={infoBg} width="100%">
        <Text textAlign="center" fontWeight="600">
          {text}
        </Text>
      </View>
    );
  }

  return <View height="$0.75" backgroundColor="$dividerBg" width="100%" />;
}
