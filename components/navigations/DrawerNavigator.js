import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {Component, createRef} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {CalendarNav} from './CalendarNav';
import {connect} from 'react-redux';
import {AuthNav} from './AuthNav';
import {getMemberDetail, updateMembers} from '../actions/member';
import HomeScreen from '../screens/HomeScreen';
import {ScrollView} from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Logout} from '../actions/auth';

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      permissions: 'NO',
    };
    this.sheet = createRef();
    this.sheetMember = createRef();
  }
  Save = () => {
    this.setState({edit: false});
    this.props.updateMembers(
      this.state.permissions,
      this.props.member_detail.id,
    );
  };
  Edit = () => {
    console.log('DETAL');
    console.log(this.props.member_detail);
    const permissions = this.props.member_detail.permissions;
    this.setState({edit: true, permissions: permissions});
  };
  render() {
    const {member_detail} = this.props;
    console.log(this.props.members);
    const lessons = [
      {
        img: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2404&q=80',
        name: 'Squat',
        cal: 22,
        duration: 10,
      },
      {
        img: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
        name: 'Pull-up',
        cal: 12,
        duration: 15,
      },
    ];
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            width: '80%',
          },
          headerShown: false,
          drawerType: 'slide',
          gestureEnabled: false,
          swipeEnabled: false,
        }}
        drawerContent={props => {
          return (
            <View style={{flex: 1}}>
              <LinearGradient
                colors={['#d3e0fe', '#00000000']}
                style={{width: '100%', padding: 20}}>
                <View
                  // source={require('../assets/BWHITE.png')}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#a4c2f5',
                  }}>
                  <FeatherIcon name="user" size={60} color={'#fff'} />
                </View>
                <Text
                  style={{
                    color: '#1f1f1f',
                    fontSize: 18,
                    fontWeight: 800,
                    fontFamily: 'Montserrat-SemiBold',
                    marginBottom: 5,
                  }}>
                  {this.props.user.username}
                </Text>
                <View style={{flexDirection: 'row'}}></View>
              </LinearGradient>

              <View style={styles.stats}>
                {/* <DrawerItemList {...props} /> */}
                {this.props.member_user.permissions == 'CE' ? (
                  <View
                    style={{
                      marginHorizontal: 20,
                      borderTopWidth: 1,
                      borderTopColor: '#ccc',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('SmsToSend');
                      }}>
                      <View style={styles.statsItem}>
                        <FeatherIcon
                          color="#010101"
                          name={'phone-outgoing'}
                          size={26}
                        />

                        <Text style={styles.statsItemLabel}>{"SMS'y"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View
                  style={{
                    marginHorizontal: 20,
                    borderTopWidth: 1,
                    borderTopColor: '#ccc',
                  }}>
                  {this.props.member_user.permissions == 'CE' ||
                  this.props.member_user.permissions == 'SS' ? (
                    <Text style={styles.groupHeader}>{'Pracownicy'}</Text>
                  ) : null}
                </View>
                {this.props.member_user.permissions == 'CE' ||
                this.props.member_user.permissions == 'SS' ? (
                  <ScrollView>
                    {this.props.members.map(item => {
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={{marginHorizontal: 15}}
                          onPress={() => {
                            this.props.getMemberDetail(item.id);
                            this.sheetMember.current.open();
                            this.setState({edit: false});
                            // handle onPress
                            // this.props.navigation.navigate('HomePage');
                          }}>
                          <View style={styles.card}>
                            <View
                              alt=""
                              resizeMode="cover"
                              style={styles.cardImg}
                              // source={{uri: img}}
                            >
                              <FeatherIcon
                                name="user"
                                size={35}
                                color={'#fff'}
                              />
                            </View>

                            <View>
                              <Text style={styles.cardTitle}>
                                {item.person.username}
                              </Text>

                              <View style={styles.cardStats}>
                                <View style={styles.cardStatsItem}>
                                  {/* <FeatherIcon color="#636a73" name="clock" /> */}

                                  <Text style={styles.cardStatsItemText}>
                                    {item.permissions}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View style={styles.cardAction}></View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : null}
              </View>

              <View
                style={{
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: '#ccc',
                }}>
                {/* <TouchableOpacity
                    onPress={() => {}}
                    style={{paddingVertical: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name="share-social-outline" size={22} />
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: 'Roboto-Medium',
                          marginLeft: 5,
                        }}>
                        Tell a Friend
                      </Text>
                    </View>
                  </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    this.sheet.current.open();
                  }}
                  style={{paddingVertical: 15}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        // fontFamily: 'Montserrat-Medium',
                        marginLeft: 5,
                        color: '#2c2c2c',
                      }}>
                      Wyloguj się{' '}
                    </Text>
                    <FeatherIcon name="log-out" color="#2c2c2c" size={20} />
                  </View>
                </TouchableOpacity>
              </View>
              <RBSheet
                customStyles={{container: styles.sheet}}
                height={300}
                openDuration={250}
                ref={this.sheet}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Uwaga!</Text>
                </View>

                <View style={styles.body}>
                  <Text style={styles.bodyText}>
                    Jesteś pewien że chcesz sie wylogować?
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.props.Logout();
                    }}>
                    <View style={styles.btn}>
                      <Text style={styles.btnText}>Wyloguj</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.bodyGap} />

                  <TouchableOpacity
                    onPress={() => {
                      this.sheet.current.close();
                    }}>
                    <View style={styles.btnSecondary}>
                      <Text style={styles.btnSecondaryText}>Anuluj</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </RBSheet>
              <RBSheet
                customStyles={{container: styles.sheet}}
                height={550}
                openDuration={250}
                ref={this.sheetMember}>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Uwaga!</Text>
                </View>

                <View style={styles.body}>
                  <Text style={styles.bodyText}>
                    Jesteś w panelu nadawaniu uprawnień urzytkowników.
                  </Text>
                  <View style={styles.card}>
                    <View
                      alt=""
                      resizeMode="cover"
                      style={styles.cardImg}
                      // source={{uri: img}}
                    >
                      <FeatherIcon name="user" size={35} color={'#fff'} />
                    </View>
                    {member_detail.person ? (
                      <View>
                        <Text style={styles.cardTitle}>
                          {member_detail.person.username}
                        </Text>

                        <View style={styles.cardStats}>
                          <View style={styles.cardStatsItem}>
                            {/* <FeatherIcon color="#636a73" name="clock" /> */}

                            <Text style={styles.cardStatsItemText}>
                              {member_detail.permissions}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : null}

                    <View style={styles.cardAction}></View>
                  </View>
                  {this.state.edit ? (
                    <>
                      <View style={{height: 60, flexDirection: 'row'}}>
                        <View style={{flex: 1, marginHorizontal: 3}}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({permissions: 'NO'});
                            }}>
                            <View
                              style={
                                this.state.permissions == 'NO'
                                  ? styles.btnPick
                                  : styles.btnSecondary
                              }>
                              <Text style={styles.btnSecondaryText}>NO</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, marginHorizontal: 3}}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({permissions: 'SS'});
                            }}>
                            <View
                              style={
                                this.state.permissions == 'SS'
                                  ? styles.btnPick
                                  : styles.btnSecondary
                              }>
                              <Text style={styles.btnSecondaryText}>SS</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        {this.state.permissions == 'NO' ? (
                          <Text style={styles.bodyText}>
                            Brak przywilejów dla pracownika, widzi jedynie
                            własny kalendarz oraz naprawy
                          </Text>
                        ) : (
                          <Text style={styles.bodyText}>
                            Pracownik widzi wszytkich kalendarz, magazyn z
                            częściami oraz naprawy innych, nie widzi jednak
                            SMS'ów
                          </Text>
                        )}
                      </View>
                    </>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      this.sheetMember.current.close();
                      this.setState({edit: false});
                    }}>
                    <View style={styles.btnSecondary}>
                      <Text style={styles.btnSecondaryText}>Anuluj</Text>
                    </View>
                  </TouchableOpacity>
                  {this.props.member_user.permissions == 'CE' ? (
                    <>
                      {!this.state.edit ? (
                        <TouchableOpacity onPress={this.Edit}>
                          <View style={styles.btn}>
                            <Text style={styles.btnText}>Edytuj</Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={this.Save}>
                          <View style={styles.btn}>
                            <Text style={styles.btnText}>Zapisz</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                </View>
              </RBSheet>
            </View>
          );
        }}>
        <Drawer.Screen
          name="Feed"
          options={{
            drawerLabel: 'Wishlist',
            title: 'Wishlist',
            headerShadowVisible: false,
          }}
          component={HomeScreen}
        />
      </Drawer.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  stats: {
    flex: 1,
    paddingTop: 50,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,

    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  statsItemLabel: {
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
    marginRight: 'auto',
    fontSize: 18,
    fontWeight: '600',
    color: '#4e4a6d',
  },
  groupHeader: {
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
    marginRight: 'auto',
    fontSize: 15,
    fontWeight: '600',
    color: '#4e4a6d',
  },
  statsItemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4e4a6d',
  },

  card: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a4c2f5',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  cardAction: {
    marginLeft: 'auto',
  },
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header: {
    borderBottomWidth: 1,
    borderColor: '#efefef',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  /** Body */
  body: {
    padding: 24,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#0e0e0e',
    marginBottom: 24,
    textAlign: 'center',
  },
  bodyGap: {
    marginBottom: 12,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#ff3c2f',
    borderColor: '#ff3c2f',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#dddce0',
  },
  btnPick: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#a4c2f5',
    borderColor: '#dddce0',
  },
  btnSecondaryText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#000',
  },
});

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  members: state.member.members,
  member_user: state.member.member_user,
  member_detail: state.member.member_detail,
});

export default connect(mapStateToProps, {
  Logout,
  getMemberDetail,
  updateMembers,
})(DrawerNavigator);
