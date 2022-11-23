import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AlgaeRecord, Photo } from "@livingsnow/record";

export type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: { record: AlgaeRecord } | undefined; // edit record or new record
  Settings: undefined;
  ImageSelection: { onUpdatePhotos: (photos: Photo[]) => void };
  RecordDetails: { record: AlgaeRecord };
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type FirstRunScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

export type TimelineScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Timeline"
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
