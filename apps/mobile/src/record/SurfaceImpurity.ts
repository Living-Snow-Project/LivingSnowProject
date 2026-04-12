import { SurfaceImpurity } from "@livingsnow/record";
import { SurfaceImpurityDescription } from "../constants/Strings";

type SurfaceImpuritySelectorItem = {
  value: SurfaceImpurity;
  label: string;
};

const getAllSurfaceImpuritySelectorItems = (): SurfaceImpuritySelectorItem[] => [
  {
    value: "Orange Dust",
    label: SurfaceImpurityDescription.OrangeDust,
  },
  {
    value: "Soot",
    label: SurfaceImpurityDescription.Soot,
  },
  {
    value: "Soil",
    label: SurfaceImpurityDescription.Soil,
  },
  {
    value: "Vegetation",
    label: SurfaceImpurityDescription.Vegetation,
  },
  {
    value: "Pollen",
    label: SurfaceImpurityDescription.Pollen,
  },
  {
    value: "Evidence of Animals",
    label: SurfaceImpurityDescription.EvidenceOfAnimals,
  },
  {
    value: "Other",
    label: SurfaceImpurityDescription.Other,
  },
];

export { getAllSurfaceImpuritySelectorItems };
