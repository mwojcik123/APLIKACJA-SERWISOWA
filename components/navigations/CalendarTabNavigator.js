import React, {Component, useRef, createRef} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import PartsAll from '../screens/PartsAll';
import PartsMagazine from '../screens/PartsMagazine';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import Clients from '../screens/Clients';

import {
  partsSearchInput,
  partsAll,
  partsAvilable,
  getAllParts,
  getAvilableParts,
} from '../actions/parts';
import PropTypes from 'prop-types';
import {
  getCalendar,
  getCalendarNext,
  getCalendarPrev,
  addEvent,
  deleateEvent,
  updateEvent,
  getEvent,
} from '../actions/calendar';
import CalendarWeek from '../common/CalendarWeek';

const Tab = createMaterialTopTabNavigator();

class PartsTabNavigaton extends Component {
  //   ref = useRef();
  state = {
    name: '',
    member: this.props.member_user.id,
    phones: null,
    next_week: 0,
    prev_week: 0,
  };

  static propTypes = {
    search: PropTypes.string.isRequired,
    searchToogle: PropTypes.bool.isRequired,
    partsSearchInput: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // this.listener = this.props.navigation.addListener('focus', () => {
    //   this.props.partsAll();
    // });
    this.props.getCalendar(
      this.state.member,
      this.state.next_week,
      this.state.prev_week,
    );

    // Tab.initialRouteName = 'elo';

    this.props.getCalendarPrev(this.state.member);
    this.props.getCalendarNext(this.state.member);
  }
  search = () => {
    if (this.props.searchToogle) {
      this.props.getAllParts();
    } else {
      this.props.getAvilableParts();
    }
  };
  render() {
    console.log(this.props.current_week);
    return (
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={this.state.searchprop}
            onChangeText={searchprop => this.setState({searchprop: searchprop})}
          />
        </View> */}

        <Tab.Navigator
          //   ref={this.ref}
          to
          initialRouteName={'elo'}
          screenOptions={{
            header: false,
          }}
          tabBarOptions={{
            style: {backgroundColor: '#fff'},
            labelStyle: {
              fontSize: 16,
              paddingVertical: 0,
              marginVertical: 0,
            },
          }}>
          {this.props.prev_week.map(item => (
            <Tab.Screen
              {...this.props}
              name={item.week}
              component={CalendarWeek}
            />
          ))}
          {this.props.current_week ? (
            <Tab.Screen
              {...this.props}
              name={'today'}
              component={CalendarWeek}
            />
          ) : (
            // <Tab.Screen name="elo5" component={CalendarWeek} />
            <Tab.Screen name="today" component={CalendarWeek} />
          )}
          {/* <Tab.Screen name="elo" component={CalendarWeek} /> */}

          {this.props.next_week.map(item => (
            <Tab.Screen
              {...this.props}
              name={item.week}
              component={CalendarWeek}
            />
          ))}
        </Tab.Navigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAction: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 100,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  search: state.parts.search,
  searchToogle: state.parts.searchToogle,
  current_week: state.calendar.current_week,
  next_week: state.calendar.next_week,
  prev_week: state.calendar.prev_week,
  member_user: state.member.member_user,
});

export default connect(mapStateToProps, {
  partsSearchInput,
  partsAll,
  partsAvilable,
  getAllParts,
  getAvilableParts,
  getCalendar,
  getCalendarNext,
  getCalendarPrev,
})(PartsTabNavigaton);
