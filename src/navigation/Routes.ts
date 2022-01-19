import { StackNavigationProp } from "@react-navigation/stack";
import { Record } from "../record/Record";

type RootStackParamList = {
  Welcome: undefined;
  Timeline: undefined;
  Record: undefined;
  Settings: undefined;
  ImageSelection: undefined;
  RecordDetails: { record: Record };
};

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

export { RootStackParamList, RootStackNavigationProp };
