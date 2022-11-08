import { StackNavigationProp } from "@react-navigation/stack";
import { AlgaeRecord } from "@livingsnow/record";

type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: undefined;
  Settings: undefined;
  ImageSelection: undefined;
  RecordDetails: { record: AlgaeRecord };
};

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export { RootStackParamList, RootStackNavigationProp };
