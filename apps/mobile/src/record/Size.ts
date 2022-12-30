import { AlgaeSize } from "@livingsnow/record";
import { AlgaeSizeDescription } from "../constants/Strings";

type AlgaeSizeSelectorItem = {
  value: AlgaeSize;
  label: string;
};

const algaeSizeSelectorItems: AlgaeSizeSelectorItem[] = [
  { value: "Fist", label: AlgaeSizeDescription.Fist },
  { value: "Shoe Box", label: AlgaeSizeDescription.ShoeBox },
  { value: "Coffee Table", label: AlgaeSizeDescription.CoffeeTable },
  { value: "Car", label: AlgaeSizeDescription.Car },
  { value: "Bus", label: AlgaeSizeDescription.Bus },
  { value: "Playground", label: AlgaeSizeDescription.Playground },
  { value: "Sports Field", label: AlgaeSizeDescription.SportsField },
  { value: "Other", label: AlgaeSizeDescription.Other },
];

const getAllAlgaeSizeSelectorItems = (): AlgaeSizeSelectorItem[] =>
  algaeSizeSelectorItems;

export { getAllAlgaeSizeSelectorItems };
