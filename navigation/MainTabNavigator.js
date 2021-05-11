import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FirstRunScreen from '../screens/FirstRunScreen';
import { ImagesPickerScreen } from '../screens/ImagesPickerScreen';
import { HeaderNavigation } from '../components/HeaderNavigation';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: true}}>
      {global.showFirstRun && <Stack.Screen name="FirstRun" component={FirstRunScreen} />}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          headerTitle: 'Timeline',
          headerTitleContainerStyle: {justifyContent: 'center'},
          headerLeft: function HomeLeft() {
            return <HeaderNavigation
              navigation={navigation}
              nextScreen='Settings'
              iosImage='ios-settings'
              androidImage='md-settings'
            />
          },
          headerLeftContainerStyle: {marginLeft: 20},
          headerRight: function HomeRight() {
            return <HeaderNavigation
              navigation={navigation}
              nextScreen='Record'
              iosImage='ios-add-circle-outline'
              androidImage='md-add-circle-outline'
            />
          },
          headerRightContainerStyle: {marginRight: 20}
        })}
      />
      <Stack.Screen
        name="Record"
        component={RecordScreen}
        options={() => ({
          title: 'Record',
          headerTitleContainerStyle: {justifyContent: 'center'},
        })}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Images" component={ImagesPickerScreen} />
    </Stack.Navigator>
  );
}
