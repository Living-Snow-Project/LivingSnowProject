import React from "react";
import { NativeBaseProvider } from "native-base";

type NativeBaseProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export default function NativeBaseProviderWrapper({
  children,
}: NativeBaseProviderProps) {
  return <NativeBaseProvider>{children}</NativeBaseProvider>;
}
