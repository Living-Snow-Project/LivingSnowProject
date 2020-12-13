import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import TabBarIcon from '../components/TabBarIcon';
import GisScreen from '../screens/GisScreen';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Record: RecordScreen,
  Settings: SettingsScreen,
  Geo: GisScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-flask' : 'md-flask'}/>
  )
};

const GisStack = createStackNavigator({
  Gis: GisScreen
});

GisStack.navigationOptions = {
  tabBarLabel: 'Geo',
  tabBarIcon: ({focused}) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-globe' : 'md-globe'}/>
  )
};

// As the app grows, likely a bottom tab navigator will be desired.
/*export default createBottomTabNavigator({
  HomeStack,
  //GisStack
});*/

export default createSwitchNavigator({
  HomeStack
});
