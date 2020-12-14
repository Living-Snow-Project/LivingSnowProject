import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { MainSwitchNavigator } from './MainTabNavigator';
import FirstRunScreen from '../screens/FirstRunScreen';

export default createAppContainer(createSwitchNavigator({
  Main: MainSwitchNavigator,
  FirstRun: FirstRunScreen,
},
{
  initialRouteName: 'FirstRun',
}));
