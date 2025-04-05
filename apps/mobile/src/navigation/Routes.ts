import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type RecordScreenRouteProps = {
  record?: string; // when coming from Timeline, Edit Mode, JSON.stringify'd AlgaeRecord
};

export type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: RecordScreenRouteProps | undefined; // undefined => new record
  Settings: undefined;
  RecordDetails: { record: string }; // JSON.stringify'd MinimalAlgaeRecord
  Map: undefined;
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

export type RecordDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RecordDetails"
>;
export type RecordDetailsScreenRouteProp = RecordDetailsScreenProps["route"];
