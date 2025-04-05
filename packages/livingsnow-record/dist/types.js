export var AlgaeSize;
(function (AlgaeSize) {
    AlgaeSize["SELECT_A_SIZE"] = "Select a size";
    AlgaeSize["FIST"] = "Fist";
    AlgaeSize["DINNER_PLATE"] = "Dinner Plate";
    AlgaeSize["BICYCLE"] = "Bicycle";
    AlgaeSize["CAR"] = "Car";
    AlgaeSize["BUS"] = "Bus";
    AlgaeSize["HOUSE"] = "Small or Medium-Sized House";
    AlgaeSize["SPORTS_FIELD"] = "Sports Field";
    AlgaeSize["OTHER"] = "Other";
})(AlgaeSize || (AlgaeSize = {}));
const AlgaeColorArray = [
    "Select colors",
    "Red",
    "Pink",
    "Grey",
    "Green",
    "Orange",
    "Yellow",
    "Other",
];
export var BloomDepthThicknessSelection;
(function (BloomDepthThicknessSelection) {
    BloomDepthThicknessSelection["SELECT_A_DEPTH"] = "Select a depth";
    BloomDepthThicknessSelection["SURFACE"] = "Surface";
    BloomDepthThicknessSelection["TWO_CM"] = "2 cm";
    BloomDepthThicknessSelection["FIVE_CM"] = "5 cm";
    BloomDepthThicknessSelection["TEN_CM"] = "10 cm";
    BloomDepthThicknessSelection["GREATER_THAN_TEN_CM"] = "Greater than 10 cm";
    BloomDepthThicknessSelection["OTHER"] = "Other";
})(BloomDepthThicknessSelection || (BloomDepthThicknessSelection = {}));
export var ImpuritiesSelection;
(function (ImpuritiesSelection) {
    ImpuritiesSelection["ORANGE_DUST"] = "Orange Dust";
    ImpuritiesSelection["SOOT"] = "Soot";
    ImpuritiesSelection["SOIL"] = "Soil";
    ImpuritiesSelection["VEGETATION"] = "Vegetation";
    ImpuritiesSelection["POLLEN"] = "Pollen";
    ImpuritiesSelection["EVIDENCE_OF_ANIMALS"] = "Evidence of Animals";
    ImpuritiesSelection["OTHER"] = "Other (describe in notes)";
})(ImpuritiesSelection || (ImpuritiesSelection = {}));
export var SnowpackThicknessSelection;
(function (SnowpackThicknessSelection) {
    SnowpackThicknessSelection["SELECT_A_THICKNESS"] = "Select a thickness";
    SnowpackThicknessSelection["LESS_THAN_10_CM"] = "Less than 10 cm";
    SnowpackThicknessSelection["BETWEEN_10_CM_30_CM"] = "Between 10 cm - 30 cm";
    SnowpackThicknessSelection["THIRTY_CM_TO_1_M"] = "30 cm - 1 m";
    SnowpackThicknessSelection["GREATER_THAN_1_M"] = "Greater than 1 m";
    SnowpackThicknessSelection["I_DONT_KNOW"] = "I don't know";
})(SnowpackThicknessSelection || (SnowpackThicknessSelection = {}));
export var UnderSnowpackSelection;
(function (UnderSnowpackSelection) {
    UnderSnowpackSelection["SELECT_AN_OPTION"] = "Select an option";
    UnderSnowpackSelection["VEGETATION"] = "Vegetation";
    UnderSnowpackSelection["ROCKS"] = "Rocks";
    UnderSnowpackSelection["SOIL"] = "Soil";
    UnderSnowpackSelection["LAKE"] = "Lake";
    UnderSnowpackSelection["STREAM"] = "Stream";
    UnderSnowpackSelection["MIXED"] = "Mixed";
    UnderSnowpackSelection["I_DONT_KNOW"] = "I don't know";
})(UnderSnowpackSelection || (UnderSnowpackSelection = {}));
const AlgaeRecordTypeArray = ["Sample", "Sighting", "Undefined"];
// Record v3 types
// required: user selects one of the following options
const WhatIsUnderSnowpackArray = [
    "Vegetation",
    "Rocks",
    "Soil",
    "Pond or tarn",
    "Lake",
    "Stream",
    "Mixed",
    "I don't know"
];
// optional?: user can select more than one of the following options
const SurfaceImpurityArray = [
    "Select impurities",
    "Orange Dust",
    "Soot",
    "Soil",
    "Vegetation",
    "Pollen",
    "Evidence of Animals",
    "Other",
];
export {};
export var ExposedIceSelection;
(function (ExposedIceSelection) {
    ExposedIceSelection["YES"] = "Yes";
    ExposedIceSelection["NO"] = "No";
})(ExposedIceSelection || (ExposedIceSelection = {}));
export var OnOffGlacierSelection;
(function (OnOffGlacierSelection) {
    OnOffGlacierSelection["YES"] = "Yes";
    OnOffGlacierSelection["NO"] = "No";
})(OnOffGlacierSelection || (OnOffGlacierSelection = {}));
