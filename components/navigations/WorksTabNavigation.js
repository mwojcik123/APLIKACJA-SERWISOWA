import React, {Component} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import PartsAll from '../screens/PartsAll';
import PartsMagazine from '../screens/PartsMagazine';

import WorksAll from '../screens/WorksAll';
import WorksDone from '../screens/WorksDone';
import WorksYour from '../screens/WorksYour';
import {
  worksSearchInput,
  getWorks,
  getWorksDone,
  getWorksServisant,
  clearWorks,
} from '../actions/works';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
const Tab = createMaterialTopTabNavigator();

class CustomTabNavigator extends Component {
  static propTypes = {
    worksSearchInput: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    thePage: PropTypes.string.isRequired,
  };
  // getWorks,
  // getWorksDone,
  // getWorksServisant,
  search = () => {
    this.props.getWorksServisant();

    this.props.getWorks();

    this.props.getWorksDone();
  };
  clear = () => {
    this.props.clearWorks();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.inputBox]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              returnKeyType="search"
              value={this.props.search}
              onChangeText={search => this.props.worksSearchInput(search)}
              onSubmitEditing={this.search}
            />
            <View style={styles.iconContainer}>
              {this.props.search == '' ? null : (
                <TouchableOpacity
                  activeOpacity={0.1}
                  style={styles.searchIcon}
                  onPress={this.clear}>
                  <AntDesign name="closecircleo" color={'#ff7a55'} size={22} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <Tab.Navigator
          tabBarOptions={{
            tabStyle: {
              height: 0,
              padding: 0,
              borderWidth: 0,
              borderColor: '#d3e0fe',
            },
            style: {backgroundColor: 'transparent'},
          }}>
          <Tab.Screen
            options={{
              tabBarButton: () => null,
              tabBarVisible: false, //hide tab bar on this screen
            }}
            // {...this.props}
            name="Twoje Naprawy"
            component={WorksYour}
          />
          {this.props.member_user.permissions == 'CE' ||
          this.props.member_user.permissions == 'SS' ? (
            <Tab.Screen
              options={{
                tabBarButton: () => null,
                tabBarVisible: false, //hide tab bar on this screen
              }}
              // {...this.props}
              name="Wszysktie"
              component={WorksAll}
            />
          ) : null}
          <Tab.Screen
            options={{
              tabBarButton: () => null,
              tabBarVisible: false, //hide tab bar on this screen
            }}
            name="Zrobiony"
            component={WorksDone}
          />
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
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#d3e0fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    minWidth: '10%',
    direction: 'rtl',
    flexDirection: 'row-reverse',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // justifyContent: 'space-between',
  },
  inputBox: {
    flex: 1,
    display: 'flex',
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginHorizontal: 2,
    marginVertical: 3,
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 9999,
    elevation: 2,
    // borderColor: COLORS.grey,
    // borderRadius: BORDER_RADIUS.radius_25,
    flexDirection: 'row',
  },
  searchIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  searchInput: {
    width: '90%',
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const mapStateToProps = state => ({
  search: state.works.search,
  thePage: state.works.thePage,
  member_user: state.member.member_user,
});
export default connect(mapStateToProps, {
  worksSearchInput,
  clearWorks,
  getWorks,
  getWorksDone,
  getWorksServisant,
})(CustomTabNavigator);
