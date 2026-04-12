import { AlgaeSize } from "@livingsnow/record";
import { AlgaeSizeDescription } from "../constants/Strings";

type AlgaeSizeSelectorItem = {
  value: AlgaeSize;
  label: string;
};

const getAllAlgaeSizeSelectorItems = (): AlgaeSizeSelectorItem[] => [
  { value: "Fist", label: AlgaeSizeDescription.Fist },
  { value: "Dinner Plate", label: AlgaeSizeDescription.DinnerPlate },
  { value: "Bicycle", label: AlgaeSizeDescription.Bicycle },
  { value: "Car", label: AlgaeSizeDescription.Car },
  { value: "Bus", label: AlgaeSizeDescription.Bus },
  { value: "House", label: AlgaeSizeDescription.House },
  { value: "Sports Field", label: AlgaeSizeDescription.SportsField },
  { value: "Other", label: AlgaeSizeDescription.Other },
];

export { getAllAlgaeSizeSelectorItems };
