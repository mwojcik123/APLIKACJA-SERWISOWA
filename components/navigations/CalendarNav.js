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
import ShowEvent from '../screens/ShowEvent';
import ShowClient from '../screens/ShowClient';
import ClientsCalendar from '../screens/ClientsCalendar';
import ShowEventCalendar from '../screens/ShowEventCalendar';
import ShowWork from '../screens/ShowWork';
import SmsToSend from '../screens/SmsToSend';

import AuthNav from './AuthNav';

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
      <Stack.Screen name="ShowEvent" component={ShowEvent} />
      <Stack.Screen name="ShowClient" component={ShowClient} />
      <Stack.Screen name="ClientsCalendar" component={ClientsCalendar} />
      <Stack.Screen name="ShowEventCalendar" component={ShowEventCalendar} />
      <Stack.Screen name="ShowWork" component={ShowWork} />
      <Stack.Screen name="SmsToSend" component={SmsToSend} />
      {/* <Stack.Screen name="Wiad" component={ChatScreenMessages} /> */}
    </Stack.Navigator>
  );
};
