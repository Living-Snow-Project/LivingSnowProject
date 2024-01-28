import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { Asset } from "expo-media-library";

type RecordScreenRouteProps = {
  record?: string; // when coming from Timeline, Edit Mode, JSON.stringify'd AlgaeRecord
  photos?: Asset[]; // when coming (back) from Image Selection
};

export type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: RecordScreenRouteProps | undefined; // undefined => new record
  Settings: undefined;
  ImageSelection: {
    existingSelection?: string[];
  };
  RecordDetails: { record: string }; // JSON.stringify'd MinimalAlgaeRecord
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type FirstRunScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

export type TimelineScreenProps = Omit<
  NativeStackScreenProps<RootStackParamList, "Timeline">,
  "route"
>;
export type TimelineScreenNavigationProp = TimelineScreenProps["navigation"];

export type RecordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Record"
>;
export type RecordScreenNavigationProp = RecordScreenProps["navigation"];
export type RecordScreenRouteProp = RecordScreenProps["route"];

export type ImagesPickerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ImageSelection"
>;
export type ImagesPickerScreenNavigationProp =
  ImagesPickerScreenProps["navigation"];
export type ImagesPickerScreenRouteProp = ImagesPickerScreenProps["route"];

export type RecordDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RecordDetails"
>;
export type RecordDetailsScreenRouteProp = RecordDetailsScreenProps["route"];
