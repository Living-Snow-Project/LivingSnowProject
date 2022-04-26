import { AlgaeSizeDescription } from "../constants/Strings";

type AlgaeSizePickerItem = {
  value: AlgaeSize;
  label: string;
};

// specific format for RNPickerSelect
const algaeSizePickerItems: AlgaeSizePickerItem[] = [
  { value: "Fist", label: AlgaeSizeDescription.Fist },
  { value: "Shoe Box", label: AlgaeSizeDescription.ShoeBox },
  { value: "Coffee Table", label: AlgaeSizeDescription.CoffeeTable },
  { value: "Car", label: AlgaeSizeDescription.Car },
  { value: "Bus", label: AlgaeSizeDescription.Bus },
  { value: "Playground", label: AlgaeSizeDescription.Playground },
  { value: "Sports Field", label: AlgaeSizeDescription.SportsField },
  { value: "Other", label: AlgaeSizeDescription.Other },
];

const getAlgaeSizePickerItem = (size: AlgaeSize): AlgaeSizePickerItem => {
  const result = algaeSizePickerItems.find((cur) => cur.value === size);

  if (result === undefined) {
    return { value: "Other", label: AlgaeSizeDescription.Other };
  }

  return result;
};

const getAllAlgaeSizePickerItems = (): AlgaeSizePickerItem[] =>
  algaeSizePickerItems;

export { getAlgaeSizePickerItem, getAllAlgaeSizePickerItems };
