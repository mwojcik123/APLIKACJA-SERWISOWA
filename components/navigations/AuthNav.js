import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Clients from '../screens/Clients';
import calendar from '../assets/images/calendar.png';
import gear from '../assets/images/gear.png';
import users from '../assets/images/users.png';
import home from '../assets/images/home.png';
import tool from '../assets/images/tool.png';
import calendarfill from '../assets/images/calendar-fill.png';
import gearfill from '../assets/images/gear-fill.png';
import usersfill from '../assets/images/users-fill.png';
import homefill from '../assets/images/home-fill.png';
import toolfill from '../assets/images/tool-fill.png';
import {Image} from 'react-native';
import PartsTabNavigation from './PartsTabNavigation';
import WorksTabNavigation from './WorksTabNavigation';
import EXCALENDARMODALS3 from '../screens/EXCALENDARMODALS3';
import DrawerNavigator from './DrawerNavigator';
import {connect} from 'react-redux';
const Tab = createBottomTabNavigator();

class AuthNav extends Component {
  // console.log(pop)
  render() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarInactiveTintColor: '#4a4a4a',
          tabBarActiveTintColor: 'black',
        }}>
        <Tab.Screen
          name="Serwis"
          component={DrawerNavigator}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({color, focused}) => (
              <Image
                source={focused ? homefill : home}
                style={{width: 25, height: 25}}
                tintColor={color}
              />
            ),
          }}
        />
        {this.props.member_user.permissions === 'CE' ||
        this.props.member_user.permissions === 'SS' ? (
          <Tab.Screen
            name="Klienci"
            component={Clients}
            options={{
              tabBarIcon: ({color, focused}) => (
                <Image
                  source={focused ? usersfill : users}
                  tintColor={color}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              ),
            }}
          />
        ) : null}
        <Tab.Screen
          name="Kalendarz"
          component={EXCALENDARMODALS3}
          options={{
            tabBarIcon: ({color, focused}) => (
              <Image
                source={focused ? calendarfill : calendar}
                style={{width: 25, height: 25}}
                tintColor={color}
              />
            ),
          }}
        />
        {this.props.member_user.permissions === 'CE' ||
        this.props.member_user.permissions === 'SS' ? (
          <Tab.Screen
            name="Części"
            component={PartsTabNavigation}
            options={{
              tabBarIcon: ({color, focused}) => (
                <Image
                  source={focused ? gearfill : gear}
                  style={{width: 25, height: 25}}
                  tintColor={color}
                />
              ),
            }}
          />
        ) : null}
        <Tab.Screen
          name="Naprawy"
          component={WorksTabNavigation}
          options={{
            tabBarIcon: ({color, focused}) => (
              <Image
                source={focused ? toolfill : tool}
                style={{width: 25, height: 25}}
                tintColor={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

const mapStateToProps = state => ({
  member_user: state.member.member_user,
});

export default connect(mapStateToProps, null)(AuthNav);
