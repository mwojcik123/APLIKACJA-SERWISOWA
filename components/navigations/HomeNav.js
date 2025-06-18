import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LoginScreen from "../screens/LoginScreen";
// import ChatScreenList from "../screens/ChatScreenList";
// import { createStackNavigator } from "@react-navigation/stack";
import Calendar2 from '../screens/Calendar2';
const Stack = createNativeStackNavigator();
import Example from '../screens/example';
import Example2 from '../screens/Example2';
import Beers from '../screens/Beers';
import AddEvent from '../screens/AddEvent';
import {AuthNav} from './AuthNav';
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#9AC4F8',
  },
  headerShown: false,
  headerTintColor: 'white',
  headerBackTitle: 'Back',
};

export const CalendarNav = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptionStyle}
      initialRouteName={'Calenadr'}>
      {/* <Stack.Screen name="Event" component={Parts} /> */}

      <Stack.Screen name="AuthNav" component={AuthNav} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      {/* <Stack.Screen name="Wiad" component={ChatScreenMessages} /> */}
    </Stack.Navigator>
  );
};
