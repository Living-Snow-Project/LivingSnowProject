import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import SettingsScreen from '../screens/SettingsScreen';

const MainStack = createStackNavigator({
  Home: HomeScreen,
  Record: RecordScreen,
  Settings: SettingsScreen
});

export const MainSwitchNavigator = createSwitchNavigator({
  MainStack
});
