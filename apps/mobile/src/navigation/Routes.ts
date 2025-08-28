import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type RecordScreenRouteProps = {
  record?: string; // Edit Mode - when coming from Timeline, JSON.stringify'd AlgaeRecordV3
  requestId?: string; // Edit Mode - when coming from Timeline, requestId
};

export type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: RecordScreenRouteProps | undefined; // undefined => new record
  Settings: undefined;
  RecordDetails: { record: string }; // JSON.stringify'd MinimalAlgaeRecordV3
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
