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
    color: { light: "#b91c1c", dark: "#ef4444" },
  },
  {
    value: "Pink",
    label: AlgaeColorDescription.Pink,
    color: { light: "#ec4899", dark: "#f472b6" },
  },
  {
    value: "Green",
    label: AlgaeColorDescription.Green,
    color: { light: "#15803d", dark: "#4ade80" },
  },
  {
    value: "Orange",
    label: AlgaeColorDescription.Orange,
    color: { light: "#f97316", dark: "#fb923c" },
  },
  {
    value: "Yellow",
    label: AlgaeColorDescription.Yellow,
    color: { light: "#ca8a04", dark: "#eab308" },
  },
  {
    value: "Grey",
    label: AlgaeColorDescription.Grey,
    color: { light: "#4b5563", dark: "#d1d5db" },
  },
  { value: "Other", label: AlgaeColorDescription.Other },
];

const getAllAlgaeColorSelectorItems = (): AlgaeColorSelectorItem[] =>
  algaeColorSelectorItems;

export { getAllAlgaeColorSelectorItems };
