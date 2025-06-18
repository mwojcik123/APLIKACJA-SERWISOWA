import React, {Component, useRef} from 'react';
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
  clearParts,
} from '../actions/parts';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createMaterialTopTabNavigator();

class PartsTabNavigaton extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    searchToogle: PropTypes.bool.isRequired,
    partsSearchInput: PropTypes.func.isRequired,
  };
  componentDidMount() {
    // this.listener = this.props.navigation.addListener('focus', () => {
    //   this.props.partsAll();
    // });
  }
  search = () => {
    this.props.getAllParts();

    this.props.getAvilableParts();
  };

  clear = () => {
    this.props.clearParts();
  };

  render() {
    // console.log(this.props.route.name);
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
        <View style={styles.header}>
          <View style={[styles.inputBox]}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              returnKeyType="search"
              value={this.props.search}
              onChangeText={search => this.props.partsSearchInput(search)}
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

          {/* <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}>
              <FeatherIcon name="more-vertical" size={24} />
            </TouchableOpacity>
          </View> */}
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
            {...this.props}
            name="Magazyn"
            component={PartsMagazine}
          />
          <Tab.Screen name="Wszystkie" component={PartsAll} />
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
  search: state.parts.search,
  searchToogle: state.parts.searchToogle,
});

export default connect(mapStateToProps, {
  partsSearchInput,
  partsAll,
  partsAvilable,
  getAllParts,
  getAvilableParts,
  clearParts,
})(PartsTabNavigaton);
