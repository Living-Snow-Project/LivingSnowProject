import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import MainSwitchNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import FirstRunScreen from '../screens/FirstRunScreen';

export default createAppContainer(createSwitchNavigator(
  {
    Main: MainSwitchNavigator,
    FirstRun: FirstRunScreen,
    //Main: MainTabNavigator
  },
  {
    initialRouteName: "FirstRun"
  }
));