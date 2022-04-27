import { AlgaeColorDescription } from "../constants/Strings";

type AlgaeColorPickerItem = {
  value: AlgaeColor;
  label: string;
};

// specific format for RNPickerSelect
const algaeColorPickerItems: AlgaeColorPickerItem[] = [
  { value: "Select a color", label: AlgaeColorDescription.Select },
  { value: "Red", label: AlgaeColorDescription.Red },
  { value: "Pink", label: AlgaeColorDescription.Pink },
  { value: "Grey", label: AlgaeColorDescription.Grey },
  { value: "Green", label: AlgaeColorDescription.Green },
  { value: "Orange", label: AlgaeColorDescription.Orange },
  { value: "Yellow", label: AlgaeColorDescription.Yellow },
  { value: "Other", label: AlgaeColorDescription.Other },
];

const getAlgaeColorPickerItem = (color: AlgaeColor): AlgaeColorPickerItem => {
  const result = algaeColorPickerItems.find((cur) => cur.value === color);

  if (result === undefined) {
    return { value: "Other", label: AlgaeColorDescription.Other };
  }

  return result;
};

const getAllAlgaeColorPickerItems = (): AlgaeColorPickerItem[] =>
  algaeColorPickerItems;

export { getAlgaeColorPickerItem, getAllAlgaeColorPickerItems };
