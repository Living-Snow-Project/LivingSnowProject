import { AlgaeColor } from "@livingsnow/record";
import { AlgaeColorDescription } from "../constants/Strings";

type AlgaeColorSelectorItem = {
  value: AlgaeColor;
  label: string;
  color?: { light: string; dark: string };
};

const algaeColorSelectorItems: AlgaeColorSelectorItem[] = [
  {
    value: "Red",
    label: AlgaeColorDescription.Red,
    color: { light: "red.700", dark: "red.500" },
  },
  {
    value: "Pink",
    label: AlgaeColorDescription.Pink,
    color: { light: "pink.500", dark: "pink.400" },
  },
  {
    value: "Green",
    label: AlgaeColorDescription.Green,
    color: { light: "green.700", dark: "green.400" },
  },
  {
    value: "Orange",
    label: AlgaeColorDescription.Orange,
    color: { light: "orange.500", dark: "orange.400" },
  },
  {
    value: "Yellow",
    label: AlgaeColorDescription.Yellow,
    color: { light: "yellow.600", dark: "yellow.500" },
  },
  {
    value: "Grey",
    label: AlgaeColorDescription.Grey,
    color: { light: "gray.600", dark: "gray.300" },
  },
  { value: "Other", label: AlgaeColorDescription.Other },
];

const getAllAlgaeColorSelectorItems = (): AlgaeColorSelectorItem[] =>
  algaeColorSelectorItems;

export { getAllAlgaeColorSelectorItems };
