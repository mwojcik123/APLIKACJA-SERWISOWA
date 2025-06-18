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
  FlatList,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
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
import {CLEAR_CLIENTS_DETAIL} from '../actions/types';
import {get_clients_detail, add_client_to_calendar} from '../actions/clients';
import {
  getCalendarDaily,
  getEvent,
  updateEvent,
  getCalendar,
  getCalendarv6,
  addEvent,
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
const {width, height} = Dimensions.get('window');
class ShowEvent extends Component {
  state = {
    logoutModal: false,
    bussy: true,
    description: '',
    per: ['SS', 'NO'],
    permissions: 'NO',
    member_id: null,
    hours: [
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
    ],
    minutes: ['00', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    hourValue: '06',
    hourValue2: '20',
    rep: true,
    overview: true,
    activation: true,
    first_name: '',
    stove: null,
    town: '',
    street: '',
    nr_house: '',
    tel: '',
  };
  sheetAddClient = createRef();
  sheetChangeTime = createRef();
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
    clearInterval(this.timerID);
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

  choiceClient = data => {
    this.props.get_clients_detail(data);
    this.sheetAddClient.current.close();
    // this.setState({modalVisibleClient: false});
  };
  addWork = e => {
    const {description_work} = this.state;
    const event = this.props.event_detail.id;
    const servisant = this.props.event_detail.servisant;
    const body = {servisant, event, description_work};
    // console.log(body)
    this.setState({description_work: ''});
    this.props.addWork(body);
    this.sheetAddClient.current.close();
  };
  addClient = e => {
    const {first_name, stove, town, street, nr_house, tel} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    });
    console.log(body);
    // this.setState({modalVisibleClientAdd: false, modalVisibleClient: false});
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
    });
    this.props.add_client_to_calendar(body);
    this.sheetAddClient.current.close();
  };
  addClient = e => {
    const {first_name, stove, town, street, nr_house, tel} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    });
    console.log(body);
    // this.setState({modalVisibleClientAdd: false, modalVisibleClient: false});
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
    });
    this.props.add_client_to_calendar(body);
    this.sheetAddClient.current.close();
  };
  addVisit = e => {
    // e.preventDefault();

    if (this.props.client) {
      const servisant = this.props.member_calendar.id;
      const client = this.props.client.id;
      const {
        hourValue,
        eventDay,
        day,
        bussy,
        hourValue2,
        overview,
        rep,
        activation,
      } = this.state;
      const description = this.state.desc;
      const data_wizyty = this.props.event_data;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        data_wizyty,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        bussy,
        overview,
        rep,
        activation,
      };
      // console.log(body)
      // console.log(eventDay)
      this.props.addEvent(body, eventDay);
      this.setState({
        modalVisible: false,
        desc: '',
        hourValue: '06',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue2: '20',
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    } else {
      const client = null;
      const servisant = this.props.member_calendar.id;
      // { this.props.get_clients_detail ? client = this.props.get_clients_detail.id : client = null}
      const {
        hourValue,
        eventDay,
        day,
        bussy,
        hourValue2,
        overview,
        rep,
        activation,
      } = this.state;
      const description = this.state.description;
      const data_wizyty = this.props.event_data;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        data_wizyty,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        bussy,
        overview,
        rep,
        activation,
      };
      // console.log(body)
      // console.log(eventDay)
      this.props.addEvent(body, eventDay);
      this.setState({
        modalVisible: false,
        hourValue: '06',
        description: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue2: '20',
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
    }
    this.props.navigation.goBack();
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
    const {
      eventModal,
      logoutModal,
      EditModal,
      workModal,
      description,
      hourValue2,
      hourValue,
      rep,
      activation,
      overview,
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    } = this.state;
    const {format_day, event_data, member_calendar} = this.props;
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
    const day = getDayOfWeek(this.props.event_data);
    const renderItem = ({item}) => (
      <View key={item.id} style={styles.client}>
        <TouchableOpacity onPress={() => this.choiceClient(item.id)}>
          <Text style={{color: 'navy'}}>{item.first_name}</Text>
          <Text style={{color: 'black'}}>
            {item.town} {item.street} {item.nr_house} tel: {item.tel}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
              Dodaj Wydarzenie
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

        <ScrollView>
          {/* <View style={styles.hero}></View> */}
          <View style={styles.content}>
            <View style={styles.container}>
              <View style={styles.contentHeader}>
                <Text style={styles.title1}>
                  {day} {event_data}
                </Text>
                <Text style={styles.title2}>
                  {member_calendar.person.username}
                </Text>
                {/* <Text style={styles.title3}> */}
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                    this.sheetChangeTime.current.open();
                  }}
                  style={{
                    // flex: 1,
                    paddingHorizontal: 6,
                    marginVertical: 6,
                  }}>
                  <View style={styles.btn}>
                    <FeatherIcon color="black" name={'watch'} size={22} />
                    <Text style={styles.btnText}>
                      {' '}
                      {this.state.hourValue}-{this.state.hourValue2}
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* </Text> */}
              </View>
              {this.props.client ? (
                <TouchableOpacity
                  style={[
                    styles.formClient,
                    {borderWidth: 2, borderColor: '#161616'},
                  ]}
                  onPress={() => {
                    this.sheetAddClient.current.open();
                  }}>
                  <View style={styles.radio}>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>
                        {'Imię i Nazwisko:'}
                      </Text>
                      <Text style={styles.radioLabel2}>
                        {this.props.client.first_name}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>{'Telefon:'}</Text>
                      <Text style={styles.radioLabel2}>
                        {this.props.client.tel}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.radio}>
                    <View style={{flex: 1}}>
                      <Text style={styles.radioLabel3}>{'Adres:'}</Text>
                      <Text style={styles.radioLabel2}>
                        <Text
                          style={[styles.radioLabel2, {fontWeight: 'bold'}]}>
                          {this.props.client.town}{' '}
                        </Text>
                        <Text
                          style={[
                            styles.radioLabel2,
                            {fontWeight: '400', color: '#454545'},
                          ]}>
                          {this.props.client.street}{' '}
                        </Text>
                        <Text
                          style={[
                            styles.radioLabel2,
                            {fontWeight: '300', color: '#454545'},
                          ]}>
                          {this.props.client.nr_house}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => {}}>
                  <View style={styles.formClient}>
                    <Text style={styles.title2}>Wybierz Klienta</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View
                style={styles.formClient}
                // key={index}
              >
                <View style={styles.radio2}>
                  <FeatherIcon color="#000" name={'eye'} size={20} />

                  <Text style={styles.radioLabel}>{'Przegląd'}</Text>
                  <TouchableOpacity
                    style={styles.radioCircle2}
                    onPress={() => this.setState({overview: !overview})}>
                    {overview ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={22} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={22} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.radio2}>
                  <FeatherIcon color="#000" name={'tool'} size={20} />

                  <Text style={styles.radioLabel}>{'Naprawa'}</Text>
                  <TouchableOpacity
                    style={styles.radioCircle2}
                    onPress={() => this.setState({rep: !rep})}>
                    {rep ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={22} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={22} />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.radio2}>
                  <FeatherIcon color="#000" name={'edit'} size={20} />

                  <Text style={styles.radioLabel}>{'Uruchomienie'}</Text>
                  <TouchableOpacity
                    style={styles.radioCircle2}
                    onPress={() => this.setState({activation: !activation})}>
                    {activation ? (
                      <FeatherIcon color="#ff1111" name={'x'} size={22} />
                    ) : (
                      <FeatherIcon color="#236a23" name={'check'} size={22} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.descriptionContainer}>
                  {/* <Text style={styles.radioLabel3}>{'Opis:'}</Text> */}
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    multiline
                    numberOfLines={4}
                    placeholder="Opis"
                    maxLength={300}
                    onChangeText={description =>
                      this.setState({description: description})
                    }
                    value={description}
                    style={{
                      backgroundColor: '#e1e5e9',
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      textAlignVertical: 'top',
                    }}
                  />
                </View>
              </View>
            </View>

            {/* <View style={styles.contentActions}>
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
            </View> */}
            <TouchableOpacity
              onPress={
                this.addVisit
                // handle onPress
              }
              style={{flex: 1, paddingHorizontal: 6, marginVertical: 6}}>
              <View style={styles.btn}>
                {/* <FeatherIcon color="#161616" name={'tool'} size={17} /> */}
                <Text style={styles.btnText}> Dodaj</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              <FeatherIcon name={'arrow-left'} size={22} color={'black'} /> Wróć
            </Text>
          </View>
        </TouchableOpacity>

        <RBSheet
          height={height - 80}
          draggable
          openDuration={250}
          ref={this.sheetAddClient}
          //   closeOnPressMask={false}
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

            <Text style={styles.sheetHeaderTitle}>
              {!this.props.client
                ? 'Klienci'
                : 'Klient: ' + this.props.client.first_name}
            </Text>

            <TouchableOpacity onPress={this.addWork}>
              <View style={{width: 60, alignItems: 'flex-end'}}>
                <Text style={styles.done}>Zamknij</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.sheetBody, {marginBottom: 330}]}>
            <View style={styles.form}>
              <View style={styles.radio}>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Imię i Nazwisko:'}</Text>
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    placeholder="Imię i Nazwisko"
                    maxLength={300}
                    onChangeText={first_name =>
                      this.setState({first_name: first_name})
                    }
                    value={first_name}
                    style={{
                      backgroundColor: '#e1e5e9',
                      //   height: 26,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      //   textAlignVertical: 'top',
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Miejscowość:'}</Text>
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    placeholder="Miejscowość"
                    maxLength={300}
                    onChangeText={town => this.setState({town: town})}
                    value={town}
                    style={{
                      backgroundColor: '#e1e5e9',
                      //   height: 26,
                      marginHorizontal: 1,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      //   textAlignVertical: 'top',
                    }}
                  />
                </View>
              </View>
              <View style={styles.radio}>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Ulica:'}</Text>
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    placeholder="Ulica"
                    maxLength={300}
                    onChangeText={street => this.setState({street: street})}
                    value={street}
                    style={{
                      backgroundColor: '#e1e5e9',
                      //   height: 26,
                      marginHorizontal: 1,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      //   textAlignVertical: 'top',
                    }}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Nr:'}</Text>
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    placeholder="Nr"
                    maxLength={300}
                    onChangeText={nr_house =>
                      this.setState({nr_house: nr_house})
                    }
                    value={nr_house}
                    style={{
                      backgroundColor: '#e1e5e9',
                      //   height: 26,
                      marginHorizontal: 1,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      //   textAlignVertical: 'top',
                    }}
                  />
                </View>
              </View>
              <View style={styles.radio}>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Tel:'}</Text>
                  <TextInput
                    editable
                    returnKeyType="go"
                    blurOnSubmit={true}
                    keyboardType="numeric"
                    placeholder="+48 000 000 000"
                    maxLength={300}
                    onChangeText={tel => this.setState({tel: tel})}
                    value={tel}
                    style={{
                      backgroundColor: '#e1e5e9',
                      //   height: 26,
                      marginHorizontal: 1,
                      paddingHorizontal: 10,
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#222',
                      //   textAlignVertical: 'top',
                    }}
                  />
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.radioLabel3}>{''}</Text>
                  <TouchableOpacity
                    onPress={this.addClient}
                    style={{marginHorizontal: 24}}>
                    <View style={{width: 60}}>
                      <Text style={styles.add}>Dodaj Klienta</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.header]}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                returnKeyType="search"
                value={this.state.searchprop}
                onChangeText={searchprop =>
                  this.setState({searchprop: searchprop})
                }
                onSubmitEditing={this.Search}
              />
            </View>

            <FlatList
              style={{width: '100%', height: '100%'}}
              data={this.props.clients_list}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </RBSheet>
        <RBSheet
          height={height - 80}
          draggable
          openDuration={250}
          ref={this.sheetChangeTime}
          //   closeOnPressMask={false}
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

            <Text style={styles.sheetHeaderTitle}>Godzina</Text>

            <TouchableOpacity
              onPress={() => this.sheetChangeTime.current.close()}>
              <View style={{width: 60, alignItems: 'flex-end'}}>
                <Text style={styles.done}>Ok</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.sheetBody}>
            <View style={styles.form}>
              <View style={styles.radio}>
                <View style={{flex: 1}}>
                  <Text style={styles.radioLabel3}>{'Godzina Od:'}</Text>
                  <ScrollView style={{marginBottom: 100}}>
                    {this.state.hours.map(item => (
                      <TouchableOpacity
                        onPress={() => this.setState({hourValue: item})}
                        style={[
                          styles.radio,
                          hourValue == item
                            ? {
                                marginHorizontal: 5,
                                marginVertical: 3,
                                backgroundColor: '#e1e5e9',
                                borderRadius: 5,
                              }
                            : {
                                marginHorizontal: 5,
                                marginVertical: 3,
                              },
                        ]}>
                        <Text style={styles.radioLabel}>{item}</Text>
                        {/* <FeatherIcon color="#000" name={'eye'} size={20} /> */}
                        <View style={styles.radioCircle}>
                          <View
                            style={[
                              hourValue == item
                                ? {
                                    backgroundColor: '#ff6a55',
                                    ...styles.radioCircleInset,
                                  }
                                : null,
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View
                  style={{flex: 1, borderLeftWidth: 1, borderColor: '#efefef'}}>
                  <Text style={styles.radioLabel3}>{'Godzina Do:'}</Text>
                  <ScrollView style={{marginBottom: 60}}>
                    {this.state.hours.map(item => (
                      <TouchableOpacity
                        onPress={() => this.setState({hourValue2: item})}
                        style={[
                          styles.radio,
                          hourValue2 == item
                            ? {
                                marginHorizontal: 5,
                                marginVertical: 3,
                                backgroundColor: '#e1e5e9',
                                borderRadius: 5,
                              }
                            : {
                                marginHorizontal: 5,
                                marginVertical: 3,
                              },
                        ]}>
                        <Text style={styles.radioLabel}>{item}</Text>
                        {/* <FeatherIcon color="#000" name={'eye'} size={20} /> */}
                        <View style={styles.radioCircle}>
                          <View
                            style={[
                              hourValue2 == item
                                ? {
                                    backgroundColor: '#ff6a55',
                                    ...styles.radioCircleInset,
                                  }
                                : null,
                            ]}
                          />
                        </View>
                        {/* <FeatherIcon color="#000" name={'eye'} size={20} /> */}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
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
  member_calendar: state.member.member_calendar,
  event_data: state.calendar.event_data,
  client: state.clients.clients_detail,
  // client: state.calendar.client,
  clients_list: state.clients.clients_list,
});

export default connect(mapStateToProps, {
  getCalendarDaily,
  getEvent,
  addEvent,
  Logout,
  updateEvent,
  addWork,
  getChatList,
  getMembers,
  updateMembers,
  get_clients_detail,
  add_client_to_calendar,
})(ShowEvent);
const CIRCLE_SIZE = 13;
const CIRCLE_RING_SIZE = 1;
const CIRCLE_SIZE2 = 18;
const CIRCLE_RING_SIZE2 = 2;
const INPUT_OFFSET = 110;
const styles = StyleSheet.create({
  form: {
    // marginLeft
    // padding: 20,
    // backgroundColor: '#ffffffdd',
    // borderRadius: 30,
    // marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  formClient: {
    // marginLeft
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
  searchInput: {
    marginVertical: 3,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 100,
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
    color: '#ff7a55',
  },
  add: {
    fontSize: 16,
    fontWeight: '600',
    color: '#236a23',
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
    paddingVertical: 8,
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
    paddingHorizontal: 4,
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
    fontSize: 25,
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
  radio2: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginVertical: 3,
  },
  radioHour: {
    paddingBottom: 60,
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
    verticalAlign: 'center',
    width: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    height: CIRCLE_SIZE + CIRCLE_RING_SIZE * 4,
    borderRadius: 9999,
    backgroundColor: 'transparent',
    borderWidth: CIRCLE_RING_SIZE,
    borderColor: '#676767',
    marginRight: 8,
    // marginBottom: 12,
  },
  radioCircleInset: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: 9999,
    position: 'absolute',
    top: CIRCLE_RING_SIZE,
    left: CIRCLE_RING_SIZE,
  },
  radioCircle2: {
    verticalAlign: 'center',
    width: CIRCLE_SIZE2 + CIRCLE_RING_SIZE2 * 4,
    height: CIRCLE_SIZE2 + CIRCLE_RING_SIZE2 * 4,
    borderRadius: 3,
    backgroundColor: 'transparent',
    borderWidth: CIRCLE_RING_SIZE2,
    borderColor: '#676767',
    marginRight: 8,
    // marginBottom: 12,
  },
  radioCircleInset2: {
    width: CIRCLE_SIZE2,
    height: CIRCLE_SIZE2,
    borderRadius: 3,
    position: 'absolute',
    top: CIRCLE_RING_SIZE2,
    left: CIRCLE_RING_SIZE2,
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
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000',
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
    fontSize: 22,
    lineHeight: 40,
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
  client: {
    flex: 1,
    marginHorizontal: 2,
    paddingHorizontal: 3,
    // paddingTop: 10,
    borderWidth: 1,
    borderColor: '#161616',
    // flex: 1,
    marginTop: 2,
    // width: '90%',
    flexDirection: 'row',
    backgroundColor: '#e1e5e9',
    borderRadius: 5,
    // paddingTop:20
  },
});
