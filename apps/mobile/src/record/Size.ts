import { AlgaeSize } from "@livingsnow/record";
import { AlgaeSizeDescription } from "../constants/Strings";

type AlgaeSizeSelectorItem = {
  value: AlgaeSize;
  label: string;
};

const algaeSizeSelectorItems: AlgaeSizeSelectorItem[] = [
  { value: AlgaeSize.FIST, label: AlgaeSizeDescription.Fist },
  { value: AlgaeSize.DINNER_PLATE, label: AlgaeSizeDescription.DinnerPlate },
  { value: AlgaeSize.BICYCLE, label: AlgaeSizeDescription.Bicycle },
  { value: AlgaeSize.CAR, label: AlgaeSizeDescription.Car },
  { value: AlgaeSize.BUS, label: AlgaeSizeDescription.Bus },
  { value: AlgaeSize.HOUSE, label: AlgaeSizeDescription.House },
  { value: AlgaeSize.SPORTS_FIELD, label: AlgaeSizeDescription.SportsField },
  { value: AlgaeSize.OTHER, label: AlgaeSizeDescription.Other },
];

const getAllAlgaeSizeSelectorItems = (): AlgaeSizeSelectorItem[] =>
  algaeSizeSelectorItems;

export { getAllAlgaeSizeSelectorItems };
