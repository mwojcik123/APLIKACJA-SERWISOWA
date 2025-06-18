import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import React, {Component, Fragment, createRef} from 'react';
import BG from '../assets/BG.png';
import SD from '../assets/SD.png';
import Beers from './Beers';
import {getMembers, updateMembers} from '../actions/member';
import {loadGroup} from '../actions/group';
import {get_member_user} from '../actions/member';
import {Logout} from '../actions/auth';
import {addWork} from '../actions/works';
import {getChatList} from '../actions/chat';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  getCalendarDaily,
  getEvent,
  updateEvent,
  getCalendar,
  getCalendarv6,
} from '../actions/calendar';
import {connect} from 'react-redux';
import store from '../store';
import PropTypes from 'prop-types';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

const items = [
  {label: 'Can view', icon: 'eye'},
  {label: 'Can edit', icon: 'edit'},
  {label: 'Can archive', icon: 'archive'},
];
class ShowEvent extends Component {
  state = {
    logoutModal: false,

    description_work: '',
    per: ['SS', 'NO'],
    permissions: 'NO',
    member_id: null,
  };
  sheet = createRef();
  // componentDidMount(){
  //   store.dispatch(loadGroup());
  //   store.dispatch(get_member_user());
  //   store.dispatch(getCalendarDaily());
  // }
  // componentWillUnmount(){
  //   store.dispatch(loadGroup());
  //   store.dispatch(get_member_user());
  //   store.dispatch(getCalendarDaily());
  // }
  componentDidMount() {
    // store.dispatch(getMembers());
    // store.dispatch(loadGroup());
    // store.dispatch(get_member_user());
    // store.dispatch(getCalendarDaily());
    // store.dispatch(getCalendar());
    // this.timerID = setInterval(() => this.tick(), 5000);
  }
  componentWillUnmount() {
    // clearInterval(this.timerID);
  }
  tick() {
    // store.dispatch(getCalendarv6());
    // store.dispatch(getChatList());
    // store.dispatch(getCalendarDaily());
  }
  static propTypes = {
    format_day: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    getEvent: PropTypes.func.isRequired,
    Logout: PropTypes.func.isRequired,
    event_detail: PropTypes.object.isRequired,
    members: PropTypes.array.isRequired,
  };

  addWork = e => {
    const {description_work} = this.state;
    const event = this.props.event_detail.id;
    const servisant = this.props.event_detail.servisant;
    const body = {servisant, event, description_work};
    // console.log(body)
    this.setState({description_work: ''});
    this.props.addWork(body);
    this.sheet.current.close();
  };

  showModal = data => {
    this.setState({eventModal: true});
  };
  hideModal = e => {
    this.setState({eventModal: false});
  };
  hideModalWork = e => {
    this.setState({workModal: false});
  };
  GetEventFunc = val => {
    this.props.getEvent(val);
  };
  Done = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: true,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id);
    this.props.navigation.goBack();
  };
  noDone = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: false,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id);
    this.props.navigation.goBack();
  };
  makeCall = tel => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${tel}`;
    } else {
      phoneNumber = `telprompt:${tel}`;
    }

    Linking.openURL(phoneNumber);
  };

  makeNAV = item => {
    let phoneNumber = '';
    console.log(
      `https://www.google.com/maps/search/?api=1&query=${item.street}+${item.nr_house}+${item.town}`,
    );

    if (Platform.OS === 'android') {
      googlemap = `https://www.google.com/maps/search/?api=1&query=${item.street}+${item.nr_house}+${item.town}`;
    } else {
      googlemap = `https://www.google.com/maps/search/?api=1&query=${item.street},${item.nr_house},${item.town}`;
    }

    Linking.openURL(googlemap);
  };

  render() {
    const {eventModal, logoutModal, EditModal, workModal, description_work} =
      this.state;
    const {format_day, event_data} = this.props;
    const permissions = this.state.permissions;
    function getDayOfWeek(dateString) {
      // Tworzymy nowy obiekt Date na podstawie przekazanej daty
      const date = new Date(dateString);
      // Tworzymy tablicę z nazwami dni tygodnia
      const daysOfWeek = [
        'Niedziela',
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota',
      ];
      // Pobieramy dzień tygodnia z obiektu Date i konwertujemy na odpowiadający mu indeks w tablicy
      const dayIndex = date.getDay();
      // Zwracamy nazwę dnia tygodnia na podstawie indeksu
      return daysOfWeek[dayIndex];
    }
    const day = getDayOfWeek(this.props.event_detail.data_wizyty);

    return (
      <View style={{width: '100%', height: '100%'}}>
        {/* <ImageBackground
          source={SD}
          blurRadius={2}
          resizeMode="contain"
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}> */}
        <View style={styles.header}>
          <View style={[{alignItems: 'flex-start', flex: 1}]}>
            <Text
              style={{
                fontSize: 20,
                fontStyle: 'italic',
                color: 'black',
              }}>
              Wydarzenie
            </Text>
          </View>
          <View style={[styles.headerAction]}>
            {/* <Image
                alt=""
                style={styles.headerImg}
                source={require('../assets/BeautyTEXTTRANSPARENTBLACK.png')}
              /> */}
          </View>

          <View style={[{alignItems: 'flex-end', flex: 1}]}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <FeatherIcon name="more-vertical" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        {this.props.event_detail.client ? (
          <ScrollView>
            {/* <View style={styles.hero}></View> */}
            <View style={styles.content}>
              <View style={styles.container}>
                <View style={styles.contentHeader}>
                  <Text style={styles.title1}>{day}</Text>
                  <Text style={styles.title2}>
                    {this.props.event_detail.data_wizyty}
                  </Text>
                  <Text style={styles.title3}>
                    <FeatherIcon name={'watch'} color="black" size={26} />{' '}
                    {this.props.event_detail.godzina_wizyty.slice(0, 5)}-
                    {this.props.event_detail.godzina_wizyty2.slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.form}>
                  <View style={styles.radio}>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>
                        {'Imię i Nazwisko:'}
                      </Text>
                      <Text style={styles.radioLabel2}>
                        {this.props.event_detail.client.first_name}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>{'Telefon:'}</Text>
                      <Text style={styles.radioLabel2}>
                        {this.props.event_detail.client.tel}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radio}>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>{'Adres:'}</Text>
                      <Text style={styles.radioLabel2}>
                        <Text
                          style={[styles.radioLabel2, {fontWeight: 'bold'}]}>
                          {this.props.event_detail.client.town}{' '}
                        </Text>
                        <Text
                          style={[
                            styles.radioLabel2,
                            {fontWeight: '400', color: '#454545'},
                          ]}>
                          {this.props.event_detail.client.street}{' '}
                        </Text>
                        <Text
                          style={[
                            styles.radioLabel2,
                            {fontWeight: '300', color: '#454545'},
                          ]}>
                          {this.props.event_detail.client.nr_house}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={styles.form}
                  // key={index}
                >
                  <View style={styles.radio}>
                    <FeatherIcon color="#000" name={'eye'} size={20} />

                    <Text style={styles.radioLabel}>{'Przegląd'}</Text>
                    {this.props.event_detail.client.overview ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={20} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={20} />
                    )}
                  </View>

                  <View style={styles.radio}>
                    <FeatherIcon color="#000" name={'tool'} size={20} />

                    <Text style={styles.radioLabel}>{'Naprawa'}</Text>
                    {this.props.event_detail.client.rep ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={20} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={20} />
                    )}
                  </View>

                  <View style={styles.radio}>
                    <FeatherIcon color="#000" name={'edit'} size={20} />

                    <Text style={styles.radioLabel}>{'Uruchomienie'}</Text>
                    {this.props.event_detail.client.activation ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={20} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={20} />
                    )}
                  </View>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.radioLabel3}>{'Opis:'}</Text>
                    <Text style={styles.radioLabel2}>
                      {this.props.event_detail.description}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{marginBottom: 60}}>
                <View style={styles.contentActions}>
                  <TouchableOpacity
                    onPress={() => this.makeNAV(this.props.event_detail.client)}
                    style={{flex: 1, paddingHorizontal: 6}}>
                    <View style={styles.btn}>
                      <FeatherIcon color="#161616" name={'map-pin'} size={17} />
                      <Text style={styles.btnText}> Nawiguj</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      this.makeCall(this.props.event_detail.client.tel)
                    }
                    style={{flex: 1, paddingHorizontal: 6, marginVertical: 6}}>
                    <View style={styles.btn}>
                      <FeatherIcon color="#161616" name={'phone'} size={17} />
                      <Text style={styles.btnText}> Zadzwoń</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    this.sheet.current.open();
                  }}
                  style={{flex: 1, paddingHorizontal: 6, marginVertical: 6}}>
                  <View style={styles.btn}>
                    <FeatherIcon color="#161616" name={'tool'} size={17} />
                    <Text style={styles.btnText}> Dodaj Do Napraw</Text>
                  </View>
                </TouchableOpacity>
                {!this.props.event_detail.done ? (
                  <TouchableOpacity
                    onPress={this.Done}
                    style={{flex: 1, paddingHorizontal: 6, marginVertical: 6}}>
                    <View style={styles.btn}>
                      <FeatherIcon
                        color="#161616"
                        name={'check-circle'}
                        size={17}
                      />

                      <Text style={styles.btnText}> Zrobione</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={this.noDone}
                    style={{flex: 1, paddingHorizontal: 6, marginVertical: 6}}>
                    <View style={styles.btn}>
                      <FeatherIcon color="#161616" name={'slash'} size={17} />
                      <Text style={styles.btnText}> Nie Zrobione</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.spiner}>
            <ActivityIndicator size="large" color="#161616" />
          </View>
        )}

        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              <FeatherIcon name={'arrow-left'} size={22} color={'black'} /> Wróć
            </Text>
          </View>
        </TouchableOpacity>

        <RBSheet
          height={300}
          draggable
          openDuration={250}
          ref={this.sheet}
          closeOnPressMask={true}
          closeOnPressBack={true}
          customModalProps={{
            animationType: 'slide',
            statusBarTranslucent: true,
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            wrapper: {
              backgroundColor: '#0000003e',
            },
            draggableIcon: {
              width: 80,
            },
          }}>
          <View style={styles.sheetHeader}>
            <View style={{width: 60}} />

            <Text style={styles.sheetHeaderTitle}>Naprawa</Text>

            <TouchableOpacity onPress={this.addWork}>
              <View style={{width: 60, alignItems: 'flex-end'}}>
                <Text style={styles.done}>Dodaj</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetBody}>
            <TextInput
              editable
              returnKeyType="go"
              blurOnSubmit={true}
              multiline
              numberOfLines={4}
              placeholder="Opis naprawy"
              maxLength={300}
              onChangeText={description_work =>
                this.setState({description_work: description_work})
              }
              value={description_work}
              style={{
                backgroundColor: '#f1f5f9',
                paddingHorizontal: 16,
                borderRadius: 12,
                fontSize: 15,
                fontWeight: '500',
                color: '#222',
                textAlignVertical: 'top',
              }}
            />
          </View>
        </RBSheet>
        {/* </ImageBackground> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  format_day: state.calendar.format_day,
  event_detail: state.calendar.event_detail,
  isAuthenticated: state.auth.isAuthenticated,
  members: state.member.members,
  member_user: state.member.member_user,
  event_data: state.calendar.event_data,
});

export default connect(mapStateToProps, {
  getCalendarDaily,
  getEvent,
  Logout,
  updateEvent,
  addWork,
  getChatList,
  getMembers,
  updateMembers,
})(ShowEvent);
const CIRCLE_SIZE = 18;
const CIRCLE_RING_SIZE = 2;
const INPUT_OFFSET = 110;
const styles = StyleSheet.create({
  form: {
    // marginLeft
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#ffffffdd',
    borderRadius: 30,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    width: INPUT_OFFSET,
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
  },
  formFooter: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '500',
    color: '#454545',
    textAlign: 'center',
  },
  // inputLabel: {
  //   position: 'absolute',
  //   width: INPUT_OFFSET,
  //   lineHeight: 44,
  //   top: 0,
  //   left: 0,
  //   bottom: 0,
  //   marginHorizontal: 12,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   fontSize: 13,
  //   fontWeight: '500',
  //   color: '#c0c0c0',
  //   zIndex: 9,
  // },
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6a55',
  },
  sheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  sheetHeaderTitle: {
    fontSize: 20,
    color: '#161616',
    fontWeight: '600',
  },
  sheetBody: {
    // flexGrow: 1,

    // height: 300,
    // width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  title1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    textAlign: 'center',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#676767',
    marginBottom: 0,
    textAlign: 'center',
  },
  title3: {
    fontSize: 26,
    fontWeight: 'normal',
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
  },
  radio: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  radioLabel: {
    fontSize: 17,

    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
  },
  radioLabel2: {
    // flex: 1,
    // paddingLeft: 0,
    fontWeight: '400',
    fontSize: 17,
    // fontWeight: '500',
    color: '#000',
    marginLeft: 10,
    marginRight: 'auto',
  },
  radioLabel3: {
    // flex: 1,
    // paddingLeft: 0,
    fontWeight: 'bold',
    fontSize: 12,
    // fontWeight: '500',
    color: '#000',
    marginLeft: 4,
    marginRight: 'auto',
  },
  radioCircle: {
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 9999,
    backgroundColor: 'transparent',
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: '#d4d4d4',
    marginRight: 8,
    marginBottom: 12,
  },
  radioCircleInset: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 9999,
    position: 'absolute',
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  contentHeader: {
    paddingHorizontal: 24,
  },
  descriptionContainer: {
    marginTop: 10,
  },

  /** Button */
  button: {
    // backgroundColor: '#56409e',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'right',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'right',
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
  },
  headerAction: {
    // flex: 1,
    flexGrow: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  btnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: 18,
    marginHorizontal: -6,
  },
  btnFacebook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#355288',
    borderColor: '#355288',
  },
  btnFacebookText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#3367D6',
    borderColor: '#3367D6',
  },
  btnGoogleText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },

  //asdasdasdas

  contentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: '#161616',
  },
  btnText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#161616',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    backgroundColor: '#266EF1',
    borderColor: '#266EF1',
  },
  btnPrimaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#fff',
  },
  spiner: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
