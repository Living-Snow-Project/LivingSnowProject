import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AlgaeRecord, Photo } from "@livingsnow/record";

export type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: { record: AlgaeRecord } | undefined; // edit record or new record
  Settings: undefined;
  ImageSelection: { onUpdatePhotos: (photos: Photo[]) => void };
  RecordDetails: { record: AlgaeRecord };
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export type FirstRunScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

export type TimelineScreenProps = StackScreenProps<
  RootStackParamList,
  "Timeline"
>;
export type TimelineScreenNavigationProp = TimelineScreenProps["navigation"];

export type RecordScreenProps = StackScreenProps<RootStackParamList, "Record">;
export type RecordScreenNavigationProp = RecordScreenProps["navigation"];
export type RecordScreenRouteProp = RecordScreenProps["route"];

export type ImagesPickerScreenProps = StackScreenProps<
  RootStackParamList,
  "ImageSelection"
>;
export type ImagesPickerScreenNavigationProp =
  ImagesPickerScreenProps["navigation"];
export type ImagesPickerScreenRouteProp = ImagesPickerScreenProps["route"];

export type RecordDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "RecordDetails"
>;
export type RecordDetailsScreenRouteProp = RecordDetailsScreenProps["route"];
