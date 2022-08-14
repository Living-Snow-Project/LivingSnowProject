import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: undefined;
  Settings: undefined;
  ImageSelection: undefined;
  RecordDetails: { record: AlgaeRecord };
};

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export { RootStackParamList, RootStackNavigationProp };
