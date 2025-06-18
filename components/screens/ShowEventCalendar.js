import React, {useRef, useState, Component, createRef, Fragment} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  FlatList,
  Linking,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import {connect} from 'react-redux';
import {getMembers, updateMembers} from '../actions/member';
import {update_client, delete_client} from '../actions/clients';
import {Logout} from '../actions/auth';
import {addWork} from '../actions/works';
import {getChatList} from '../actions/chat';
import duval from '../assets/imgs/duval4.jpg';
import {
  getCalendarDaily,
  getEvent,
  updateEvent,
  deleateEvent,
} from '../actions/calendar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import clock from '../assets/images/clock.png';
import {CLEAR_CLIENTS_DETAIL, CLEAR_EVENT} from '../actions/types';
import TickTime from '../common/TickTime';
import store from '../store';
const SECTION_TOP_OFFSET = 200;
const SECTION_BORDER_RADIUS = 40;
const {width, height} = Dimensions.get('window');
const tags = ['ios', 'android', 'web', 'ui', 'ux'];
const stats = [
  {label: 'Location', value: 'USA'},
  {label: 'Job Type', value: 'Full Time'},
  {label: 'Experience', value: '6 years'},
];
const items = [
  {
    icon: 'figma',
    label: 'Senior UI/UX Designer',
    company: 'Figma',
    jobType: 'Full Time',
    years: '2019-2023',
  },
  {
    icon: 'github',
    label: 'Mid-level Designer',
    company: 'GitHub',
    jobType: 'Full Time',
    years: '2017-2019',
  },
  {
    icon: 'twitter',
    label: 'Junior Designer',
    company: 'Twitter',
    jobType: 'Full Time',
    years: '2015-2017',
  },
];
const colors = [
  '#2F4F4F',
  '#32CD32',
  '#3CB371',
  '#40E0D0',
  '#4169E1',
  '#4682B4',
  '#483D8B',
  '#48D1CC',
  '#4B0082',
  '#556B2F',
  '#5F9EA0',
  '#6495ED',
  '#66CDAA',
  '#696969',
  '#6A5ACD',
  '#6B8E23',
  '#708090',
  '#778899',
  '#7B68EE',
  '#7CFC00',
  '#7FFF00',
  '#7FFFD4',
  '#800000',
  '#800080',
  '#808000',
  '#808080',
  '#87CEEB',
  '#87CEFA',
  '#8A2BE2',
  '#8B0000',
  '#8B008B',
  '#8B4513',
  '#8FBC8F',
  '#90EE90',
  '#9370DB',
  '#9400D3',
  '#98FB98',
  '#9932CC',
  '#9ACD32',
  '#A0522D',
  '#A52A2A',
  '#A9A9A9',
  '#ADD8E6',
  '#ADFF2F',
  '#AFEEEE',
  '#B0C4DE',
  '#B0E0E6',
  '#B22222',
  '#B8860B',
  '#BA55D3',
  '#BC8F8F',
  '#BDB76B',
  '#C0C0C0',
  '#C71585',
  '#CD5C5C',
  '#CD853F',
  '#D2691E',
  '#D2B48C',
  '#D3D3D3',
  '#D8BFD8',
  '#DA70D6',
  '#DAA520',
  '#DB7093',
  '#DC143C',
  '#DCDCDC',
  '#DDA0DD',
  '#DEB887',
];
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
// const dayIndex = moment(day).format();
const monthsOfYear = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const monthName = monthsOfYear[monthIndex];
  const day = date.getDate();
  return `${year},${monthName} ${day}`;
}
const CARD_WIDTH = Math.min(Dimensions.get('screen').width * 0.75, 400);

const renderItem = ({item}) => (
  <View style={styles.windowEvent}>
    <View style={styles.eventContainer}>
      <Text style={styles.textOverview}>{item.servisant.person.username}</Text>
      <View style={styles.statsItem}>
        {/* <FeatherIcon name="clock" color="#185aca" size={24} /> */}
        <FeatherIcon name="calendar" size={20} color="#212121" />
        <Text style={styles.statsItemText}>{formatDate(item.data_wizyty)}</Text>
      </View>
      {/* <Text>Username: {item.servisant.person.username}</Text> */}

      {/* <Text>Godzina Wizyty: {item.godzina_wizyty}</Text> */}
      <View style={styles.radio2}>
        <FeatherIcon color="#000" name={'eye'} size={14} />

        <Text style={styles.radioLabel}>{'Przegląd'}</Text>
        <TouchableOpacity
          style={styles.radioCircle2}
          onPress={() => this.setState({overview: !overview})}>
          {item.overview ? (
            <FeatherIcon color="#ff1111" name={'x'} size={14} />
          ) : (
            <FeatherIcon color="#236a23" name={'check'} size={14} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.radio2}>
        <FeatherIcon color="#000" name={'tool'} size={14} />

        <Text style={styles.radioLabel}>{'Naprawa'}</Text>
        <TouchableOpacity style={styles.radioCircle2}>
          {item.rep ? (
            <FeatherIcon color="#ff1111" name={'x'} size={14} />
          ) : (
            <FeatherIcon color="#236a23" name={'check'} size={14} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.radio2}>
        <FeatherIcon color="#000" name={'edit'} size={14} />

        <Text style={styles.radioLabel}>{'Uruchomienie'}</Text>
        <TouchableOpacity style={styles.radioCircle2}>
          {item.activation ? (
            <FeatherIcon color="#ff1111" name={'x'} size={14} />
          ) : (
            <FeatherIcon color="#236a23" name={'check'} size={14} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.radioLabel}>opis: {item.description}</Text>
    </View>
  </View>
);
class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      minutes: [
        '00',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
      ],
      hourValue: '06',
      hourValue2: '20',
      rep: true,
      overview: true,
      overviewCount: 1,
      activation: true,
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
      edit: false,
    };
    this.sheet = createRef();
    this.sheetChangeTime = createRef();

    this.flatListHour = createRef();
    this.flatListHour2 = createRef();

    this.sheetChangeTime = createRef();
  }
  onChange = e => this.setState({[e.target.name]: e.target.value});
  Done = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: true,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id, data_wizyty);
    this.props.navigation.goBack();
  };
  oneMoreOverwiew = val => {
    this.setState({overviewCount: this.state.overviewCount + 1});
  };

  oneLessOverwiew = val => {
    if (this.state.overviewCount - 1 > 0)
      this.setState({overviewCount: this.state.overviewCount - 1});
  };
  Open() {
    this.sheetChangeTime.current.open();
    // this.flatListHour.current.scrollToItem({
    //   item: this.state.hourValue,
    //   animated: true,
    // });
    setTimeout(
      () =>
        this.flatListHour2.current.scrollToItem({item: this.state.hourValue2}),
      0,
    );
    setTimeout(
      () =>
        this.flatListHour.current.scrollToItem({item: this.state.hourValue}),
      0,
    );
  }
  noDone = val => {
    const {servisant, data_wizyty, description} = this.props.event_detail;
    const body = {
      servisant,
      data_wizyty,
      description,
      done: false,
    };
    console.log(body);
    this.props.updateEvent(body, this.props.event_detail.id, data_wizyty);
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

  Edit = e => {
    const description = this.props.event_detail.description;
    const godzina = this.props.event_detail.godzina_wizyty;
    const godzina2 = this.props.event_detail.godzina_wizyty2;
    const bussy = this.props.event_detail.bussy;
    const hourValue = godzina.substring(0, 2);
    const hourValue2 = godzina2.substring(0, 2);
    const overview = this.props.event_detail.overview;
    const overviewCount = this.props.event_detail.overviewCount;
    const rep = this.props.event_detail.rep;
    const activation = this.props.event_detail.activation;
    this.setState({
      edit: true,
      description: description,
      hourValue: hourValue,
      bussy: bussy,
      hourValue2: hourValue2,
      overview: overview,
      overviewCount: overviewCount,
      rep: rep,
      activation: activation,
    });
  };

  Save = e => {
    if (this.props.clients_detail) {
      const servisant = this.props.member_calendar.id;
      const client = this.props.clients_detail.id;
      const {
        hourValue,
        bussy,
        hourValue2,
        overview,
        overviewCount,
        rep,
        activation,
      } = this.state;
      const data_wizyty = this.props.event_detail.data_wizyty;
      const description = this.state.description;
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        data_wizyty,
        bussy,
        overview,
        rep,
        activation,
        overviewCount,
      };
      console.log(body);
      this.props.updateEvent(body, this.props.event_detail.id, data_wizyty);
      this.setState({
        showModalEvent: false,
        description: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue: '06',
        hourValue2: '20',
        edit: false,
        overviewCount: 1,
      });
      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
      store.dispatch({type: CLEAR_EVENT});
    } else {
      const {overview, rep, activation, overviewCount} = this.state;
      const client = null;
      const servisant = this.props.member_calendar.id;
      // { this.props.get_clients_detail ? client = this.props.get_clients_detail.id : client = null}
      const {hourValue, bussy, hourValue2} = this.state;
      const description = this.state.description;
      const data_wizyty = this.props.event_detail.data_wizyty;
      const godzina_wizyty2 = hourValue2 + ':' + '00' + ':' + '00';
      const godzina_wizyty = hourValue + ':' + '00' + ':' + '00';
      const body = {
        servisant,
        client,
        godzina_wizyty,
        godzina_wizyty2,
        description,
        data_wizyty,
        bussy,
        overview,
        rep,
        activation,
        overviewCount,
      };
      console.log(body);
      this.props.updateEvent(body, this.props.event_detail.id, data_wizyty);
      this.setState({
        showModalEvent: false,
        description: '',
        bussy: true,
        overview: true,
        rep: true,
        activation: true,
        hourValue: '06',
        hourValue: '20',
        edit: false,
        overviewCount: 1,
      });

      store.dispatch({type: CLEAR_CLIENTS_DETAIL});
      store.dispatch({type: CLEAR_EVENT});
    }
    this.props.navigation.goBack();
  };
  Deleate = () => {
    this.props.deleateEvent(
      this.props.event_detail.id,
      this.props.event_detail.data_wizyty,
    );
    this.props.navigation.goBack();
  };

  render() {
    const {
      eventModal,
      logoutModal,
      EditModal,
      workModal,
      description_work,
      description,
      overviewCount,

      overview,
      rep,
      activation,
    } = this.state;

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
    const {event_detail, clients_detail} = this.props;
    const {
      first_name,
      town,
      street,
      nr_house,
      tel,
      edit,
      hourValue,
      hourValue2,
    } = this.state;

    return (
      <View style={styles.window}>
        {!edit ? (
          <>
            <StatusBar
              backgroundColor={
                event_detail.godzina_wizyty
                  ? event_detail.bussy
                    ? event_detail.done
                      ? '#999999'
                      : '#a4c2f5'
                    : '#ffcccc'
                  : '#a4c2f5'
              }
              barStyle={'light-content'}
            />
            <ScrollView
              style={styles.container}
              bounces={false}
              showsVerticalScrollIndicator={false}>
              <View
                style={
                  event_detail.godzina_wizyty
                    ? event_detail.bussy
                      ? event_detail.done
                        ? {backgroundColor: '#999999'}
                        : {backgroundColor: '#a4c2f5'}
                      : {backgroundColor: '#ffcccc'}
                    : {backgroundColor: '#a4c2f5'}
                }>
                <View
                  style={[
                    styles.imageBG,
                    event_detail.godzina_wizyty
                      ? event_detail.bussy
                        ? event_detail.done
                          ? {backgroundColor: '#999999'}
                          : {backgroundColor: '#a4c2f5'}
                        : {backgroundColor: '#ffcccc'}
                      : {backgroundColor: '#a4c2f5'},
                  ]}>
                  <View style={styles.header}>
                    <View style={[styles.headerAction]}>
                      {/* <Image
              alt=""
              style={styles.headerImg}
              source={require('../assets/BeautyTEXTTRANSPARENTBLACK.png')}
            /> */}

                      <TouchableOpacity
                        style={styles.headerBadge}
                        onPress={
                          // handle onPress
                          () => this.props.navigation.goBack()
                        }>
                        {/* <Text>Today</Text> */}
                        <FeatherIcon
                          name="chevron-left"
                          size={26}
                          color="#185aca"
                        />
                        {/* <FeatherIcon name="more-vertical" size={24} /> */}
                      </TouchableOpacity>
                    </View>
                    {event_detail.godzina_wizyty ? (
                      <View
                        style={[styles.headerAction, {alignItems: 'flex-end'}]}>
                        <TouchableOpacity
                          // style={styles.headerBadge}
                          onPress={
                            // handle onPress
                            this.loadToday
                          }>
                          <Text style={styles.title3}>{day}</Text>
                          <Text style={styles.title4}>
                            {formatDate(this.props.event_detail.data_wizyty)}
                          </Text>
                          {/* <FeatherIcon name="bookmark" size={26} color="#185aca" /> */}
                          {/* <FeatherIcon name="more-vertical" size={24} /> */}
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>

                <View style={[styles.imageBG]}>
                  {event_detail.godzina_wizyty ? (
                    <>
                      {event_detail.bussy ? (
                        <>
                          {event_detail.godzina_wizyty ? (
                            <View
                              style={[
                                styles.cardImage,

                                event_detail.done
                                  ? {backgroundColor: '#999999'}
                                  : {backgroundColor: '#a4c2f5'},
                              ]}>
                              <ImageBackground
                                source={clock}
                                tintColor={'white'}
                                style={styles.backdrop}
                                resizeMode="cover">
                                <View
                                  style={{
                                    height: '100%',
                                    width: '100%',
                                    alignItems: 'center',
                                    resizeMode: 'cover',
                                    justifyContent: 'center',
                                  }}>
                                  {event_detail.godzina_wizyty ? (
                                    <>
                                      <Text style={styles.title1}>
                                        {event_detail.godzina_wizyty.substring(
                                          0,
                                          2,
                                        )}
                                        {'-'}
                                        {event_detail.godzina_wizyty2.substring(
                                          0,
                                          2,
                                        )}
                                      </Text>

                                      <TickTime
                                        godzina_wizyty={
                                          event_detail.godzina_wizyty
                                        }
                                        data_wizyty={event_detail.data_wizyty}
                                      />
                                    </>
                                  ) : null}
                                </View>
                              </ImageBackground>
                            </View>
                          ) : null}
                        </>
                      ) : (
                        <Text style={styles.bussy}>Zajęty termin</Text>
                      )}
                    </>
                  ) : null}
                </View>
                {event_detail.godzina_wizyty ? (
                  <>
                    {!event_detail.bussy ? (
                      <FeatherIcon
                        style={{position: 'absolute', bottom: 20, right: 20}}
                        color="#ff1111"
                        name={'check-circle'}
                        size={60}
                      />
                    ) : (
                      <>
                        {event_detail.done ? (
                          <FeatherIcon
                            style={{
                              position: 'absolute',
                              bottom: 20,
                              right: 20,
                            }}
                            color="#236a23"
                            name={'check-circle'}
                            size={60}
                          />
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}
              </View>
              <View style={{backgroundColor: '#fff', paddingBottom: 18}}>
                {!event_detail.godzina_wizyty ? (
                  <ActivityIndicator
                    size="large"
                    color="#185aca"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                ) : null}
                {event_detail.client ? (
                  <Text style={styles.sectionTitle}>Klient</Text>
                ) : null}
                <>
                  {event_detail.client ? (
                    <View style={styles.container2}>
                      <View
                        style={[
                          styles.leftClient,
                          {
                            backgroundColor: event_detail.client.color,
                          },
                        ]}>
                        <Text style={styles.cardAvatarText}>
                          {event_detail.client.first_name[0]}
                        </Text>
                      </View>
                      <View style={styles.rightClient}>
                        <Text style={{color: '#185aca', fontSize: 22}}>
                          {event_detail.client.first_name}
                        </Text>
                        <Text style={{color: '#333333', fontSize: 17}}>
                          <FeatherIcon
                            name="map-pin"
                            color="#333333"
                            size={14}
                          />{' '}
                          {event_detail.client.town}{' '}
                          {event_detail.client.street}{' '}
                          {event_detail.client.nr_house}
                        </Text>
                        <Text style={{color: '#444444', fontSize: 17}}>
                          <FeatherIcon name="phone" color="#444444" size={14} />{' '}
                          {event_detail.client.tel}{' '}
                          {event_detail.client.tel2 ? (
                            <Fragment>
                              <FeatherIcon
                                name="phone"
                                color="#444444"
                                size={14}
                              />{' '}
                              {event_detail.client.tel2}
                            </Fragment>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  {event_detail.godzina_wizyty ? (
                    <>
                      <Text style={styles.sectionTitle}>Opis</Text>
                      <View
                        style={styles.form}
                        // key={index}
                      >
                        {event_detail.bussy ? (
                          <>
                            <View style={styles.radio2}>
                              <FeatherIcon
                                color="#000"
                                name={'eye'}
                                size={25}
                              />

                              <Text style={styles.radioLabel}>
                                {'Przegląd'}
                                {!event_detail.overview &
                                (event_detail.overviewCount > 1)
                                  ? ' x' + event_detail.overviewCount
                                  : null}
                              </Text>
                              {event_detail.overview ? (
                                <FeatherIcon
                                  color="#ff1111"
                                  name={'x'}
                                  size={25}
                                />
                              ) : (
                                <FeatherIcon
                                  color="#236a23"
                                  name={'check'}
                                  size={20}
                                />
                              )}
                            </View>

                            <View style={styles.radio2}>
                              <FeatherIcon
                                color="#000"
                                name={'tool'}
                                size={25}
                              />

                              <Text style={styles.radioLabel}>{'Naprawa'}</Text>
                              {event_detail.rep ? (
                                <FeatherIcon
                                  color="#ff1111"
                                  name={'x'}
                                  size={25}
                                />
                              ) : (
                                <FeatherIcon
                                  color="#236a23"
                                  name={'check'}
                                  size={20}
                                />
                              )}
                            </View>

                            <View style={styles.radio2}>
                              <FeatherIcon
                                color="#000"
                                name={'edit'}
                                size={25}
                              />

                              <Text style={styles.radioLabel}>
                                {'Uruchomienie'}
                              </Text>
                              {event_detail.activation ? (
                                <FeatherIcon
                                  color="#ff1111"
                                  name={'x'}
                                  size={25}
                                />
                              ) : (
                                <FeatherIcon
                                  color="#236a23"
                                  name={'check'}
                                  size={20}
                                />
                              )}
                            </View>
                          </>
                        ) : null}
                        {event_detail.description ? (
                          <View style={styles.descriptionContainer}>
                            <Text style={styles.radioLabel3}>
                              {'Informacja:'}
                            </Text>
                            <Text style={styles.radioLabel2}>
                              {event_detail.description}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </>
                  ) : null}
                </>
                {clients_detail ? (
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 12,
                      marginVertical: 4,
                      marginTop: 24,
                      flexDirection: 'row',
                    }}>
                    <View style={{flex: 1, marginHorizontal: 4}}>
                      <TouchableOpacity
                        style={styles.headerBadgeButtons2}
                        onPress={() => this.makeNAV(clients_detail)}>
                        <FeatherIcon name="map-pin" size={20} color="black" />
                        <Text style={styles.textTagline}> Nawiguj</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, marginHorizontal: 4}}>
                      <TouchableOpacity
                        style={styles.headerBadgeButtons2}
                        onPress={() => this.makeCall(clients_detail.tel)}>
                        <FeatherIcon name="phone" size={20} color="black" />
                        <Text style={styles.textTagline}> Telefon</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {event_detail.godzina_wizyty ? (
                  <>
                    {event_detail.bussy ? (
                      <>
                        <View
                          style={{
                            flex: 1,
                            marginHorizontal: 12,
                            marginVertical: 4,
                            flexDirection: 'row',
                          }}>
                          <View style={{flex: 1, marginHorizontal: 4}}>
                            <TouchableOpacity
                              style={styles.headerBadgeButtons2}
                              onPress={() => this.sheet.current.open()}>
                              <FeatherIcon
                                name="tool"
                                size={20}
                                color="black"
                              />
                              <Text style={styles.textTagline}> Naprawa</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            marginHorizontal: 12,
                            marginVertical: 4,
                            flexDirection: 'row',
                          }}>
                          {!event_detail.done ? (
                            <View style={{flex: 1, marginHorizontal: 4}}>
                              <TouchableOpacity
                                style={styles.headerBadgeButtons2}
                                onPress={this.Done}>
                                <FeatherIcon
                                  name="check-circle"
                                  size={20}
                                  color="black"
                                />
                                <Text style={styles.textTagline}>
                                  {' '}
                                  Zrobione
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={{flex: 1, marginHorizontal: 4}}>
                              <TouchableOpacity
                                style={styles.headerBadgeButtons2}
                                onPress={this.noDone}>
                                <FeatherIcon
                                  name="x-circle"
                                  size={20}
                                  color="black"
                                />
                                <Text style={styles.textTagline}>
                                  {' '}
                                  Nie zrobione
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </>
                    ) : null}
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 12,
                        marginVertical: 4,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, marginHorizontal: 4}}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtons2}
                          onPress={this.Edit}>
                          <FeatherIcon name="edit-3" size={20} color="black" />
                          <Text style={styles.textTagline}> Edytuj</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 12,
                        marginVertical: 4,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, marginHorizontal: 4}}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtons2}
                          onPress={() => this.props.navigation.goBack()}>
                          <Text style={styles.textTagline}>Wróć</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : null}
              </View>
            </ScrollView>

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
          </>
        ) : (
          <>
            <StatusBar
              backgroundColor={this.state.bussy ? '#d3e0fe' : '#ffcccc'}
              barStyle={'light-content'}
            />
            <ScrollView
              style={styles.container}
              bounces={false}
              showsVerticalScrollIndicator={false}>
              <View
                style={{
                  backgroundColor: this.state.bussy ? '#d3e0fe' : '#ffcccc',
                }}>
                <View
                  style={[
                    styles.imageBG,
                    ,
                    {backgroundColor: this.state.bussy ? '#d3e0fe' : '#ffcccc'},
                  ]}>
                  <View style={styles.header}>
                    <View style={[styles.headerAction]}>
                      {/* <Image
              alt=""
              style={styles.headerImg}
              source={require('../assets/BeautyTEXTTRANSPARENTBLACK.png')}
            /> */}

                      <TouchableOpacity
                        style={styles.headerBadge}
                        onPress={
                          // handle onPress
                          () => this.props.navigation.goBack()
                        }>
                        {/* <Text>Today</Text> */}
                        <FeatherIcon
                          name="chevron-left"
                          size={26}
                          color="#185aca"
                        />
                        {/* <FeatherIcon name="more-vertical" size={24} /> */}
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        styles.headerAction,
                        {alignItems: 'flex-end', flex: 3},
                      ]}>
                      {/* <Text style={styles.title2}>Dodaj Wydarzenie</Text> */}
                      <Text style={styles.title2}>Edytuj Wydarzenie</Text>

                      <Text style={styles.title3}>
                        {formatDate(this.props.event_detail.data_wizyty)}
                      </Text>
                      <Text style={styles.title4}>{day}</Text>

                      {/* <FeatherIcon name="bookmark" size={26} color="#185aca" /> */}
                      {/* <FeatherIcon name="more-vertical" size={24} /> */}
                    </View>
                  </View>
                </View>

                <View style={[styles.imageBG]}>
                  {this.state.bussy ? (
                    <TouchableOpacity
                      onPress={() => this.Open()}
                      style={[
                        styles.cardImage,
                        !this.state.bussy
                          ? {backgroundColor: '#d3e0fe'}
                          : {backgroundColor: '#d3e0fe'},
                      ]}>
                      <ImageBackground
                        source={clock}
                        tintColor={'white'}
                        style={styles.backdrop}
                        resizeMode="cover">
                        <View
                          style={{
                            height: '100%',
                            width: '100%',
                            alignItems: 'center',
                            resizeMode: 'cover',
                            justifyContent: 'center',
                          }}>
                          <>
                            <Text style={styles.title1}>
                              {this.state.hourValue}-{this.state.hourValue2}
                            </Text>
                          </>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.bussy}>Zajęty termin</Text>
                  )}
                </View>
                {!this.state.bussy ? (
                  <TouchableOpacity
                    onPress={bussy => {
                      this.setState({bussy: !this.state.bussy}),
                        store.dispatch({type: CLEAR_CLIENTS_DETAIL});
                    }}
                    style={{position: 'absolute', bottom: 20, right: 20}}>
                    <FeatherIcon
                      color="#ff1111"
                      name={'check-circle'}
                      size={60}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={bussy => {
                      this.setState({bussy: !this.state.bussy}),
                        store.dispatch({type: CLEAR_CLIENTS_DETAIL});
                    }}
                    style={{position: 'absolute', bottom: 20, right: 20}}>
                    <FeatherIcon color="#444444" name={'x'} size={60} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{backgroundColor: '#fff'}}>
                <>
                  {this.state.bussy ? (
                    <>
                      {clients_detail ? (
                        <View style={{marginBottom: 5}}>
                          <Text style={styles.sectionTitle}>Klient</Text>
                          <TouchableOpacity
                            style={styles.container2}
                            onPress={() =>
                              this.props.navigation.navigate('ClientsCalendar')
                            }>
                            <View
                              style={[
                                styles.leftClient,
                                {
                                  backgroundColor: clients_detail.color,
                                },
                              ]}>
                              <Text style={styles.cardAvatarText}>
                                {clients_detail.first_name[0]}
                              </Text>
                            </View>

                            <View style={styles.rightClient}>
                              <Text style={{color: '#185aca', fontSize: 22}}>
                                {clients_detail.first_name}
                              </Text>
                              <Text
                                style={{
                                  color: '#333333',
                                  fontSize: 17,
                                  // width: '90%',
                                }}>
                                <FeatherIcon
                                  name="map-pin"
                                  color="#333333"
                                  size={14}
                                />{' '}
                                {clients_detail.town} {clients_detail.street}{' '}
                                {clients_detail.nr_house}
                              </Text>
                              <Text style={{color: '#444444', fontSize: 17}}>
                                <FeatherIcon
                                  name="phone"
                                  color="#444444"
                                  size={14}
                                />{' '}
                                {clients_detail.tel}{' '}
                                {clients_detail.tel2 ? (
                                  <Fragment>
                                    <FeatherIcon
                                      name="phone"
                                      color="#444444"
                                      size={14}
                                    />{' '}
                                    {clients_detail.tel2}
                                  </Fragment>
                                ) : null}
                              </Text>
                            </View>
                            <View style={{marginLeft: 'auto', height: '100%'}}>
                              <Text
                                style={{
                                  // textAlign: 'center',
                                  // textAlign: 'right',
                                  marginVertical: 18,
                                  textAlignVertical: 'center',
                                  fontSize: 24,
                                  color: '#333333',
                                  // position: 'absolute',
                                  // top: '50%',
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    store.dispatch({type: CLEAR_CLIENTS_DETAIL})
                                  }>
                                  <FeatherIcon
                                    name="x"
                                    size={40}
                                    color={'#212121'}
                                  />
                                </TouchableOpacity>
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#d3e0fe',
                            marginHorizontal: 20,
                            marginVertical: 30,
                            borderRadius: 10,
                            // borderStyle: 'dashed',
                            // bor
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('ClientsCalendar');
                          }}>
                          <View style={[styles.formClient, {margin: 20}]}>
                            <Text style={styles.title1}>Wybierz Klienta</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                  <Text style={styles.sectionTitle}>Opis</Text>
                  <View
                    style={styles.form}
                    // key={index}
                  >
                    {this.state.bussy ? (
                      <>
                        <View style={styles.radio2}>
                          <FeatherIcon color="#000" name={'eye'} size={25} />

                          <Text style={styles.radioLabel}>{'Przegląd'}</Text>
                          {!overview ? (
                            <View style={styles.container3}>
                              <View style={styles.counter}>
                                <TouchableOpacity
                                  style={styles.counterAction}
                                  onPress={this.oneLessOverwiew}>
                                  <Text style={styles.counterActionText}>
                                    -
                                  </Text>
                                </TouchableOpacity>

                                <Text style={styles.counterValue}>
                                  {overviewCount}
                                </Text>

                                <TouchableOpacity
                                  onPress={this.oneMoreOverwiew}
                                  style={styles.counterAction}>
                                  <Text style={styles.counterActionText}>
                                    +
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : null}
                          <TouchableOpacity
                            style={styles.radioCircle2}
                            onPress={() =>
                              this.setState({overview: !overview})
                            }>
                            {overview ? (
                              <FeatherIcon
                                color="#ff1111"
                                name={'x'}
                                size={25}
                              />
                            ) : (
                              <FeatherIcon
                                color="#236a23"
                                name={'check'}
                                size={25}
                              />
                            )}
                          </TouchableOpacity>
                        </View>

                        <View style={styles.radio2}>
                          <FeatherIcon color="#000" name={'tool'} size={25} />

                          <Text style={styles.radioLabel}>{'Naprawa'}</Text>
                          <TouchableOpacity
                            style={styles.radioCircle2}
                            onPress={() => this.setState({rep: !rep})}>
                            {rep ? (
                              <FeatherIcon
                                color="#ff1111"
                                name={'x'}
                                size={25}
                              />
                            ) : (
                              <FeatherIcon
                                color="#236a23"
                                name={'check'}
                                size={25}
                              />
                            )}
                          </TouchableOpacity>
                        </View>

                        <View style={styles.radio2}>
                          <FeatherIcon color="#000" name={'edit'} size={25} />

                          <Text style={styles.radioLabel}>
                            {'Uruchomienie'}
                          </Text>

                          <TouchableOpacity
                            style={styles.radioCircle2}
                            onPress={() =>
                              this.setState({activation: !activation})
                            }>
                            {activation ? (
                              <FeatherIcon
                                color="#ff1111"
                                name={'x'}
                                size={25}
                              />
                            ) : (
                              <FeatherIcon
                                color="#236a23"
                                name={'check'}
                                size={25}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : null}
                    <View style={styles.descriptionContainer}>
                      {/* <Text style={styles.radioLabel3}>{'Opis:'}</Text> */}
                      <TextInput
                        editable
                        returnKeyType="go"
                        blurOnSubmit={true}
                        multiline
                        numberOfLines={4}
                        placeholder="informacja"
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
                </>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 4,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, marginHorizontal: 8}}>
                    <TouchableOpacity
                      style={[
                        styles.headerBadgeButtons2,
                        {backgroundColor: '#ffcccc'},
                      ]}
                      onPress={this.Deleate}>
                      <Text style={styles.textTagline}>Usuń</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 4,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, marginHorizontal: 8}}>
                    <TouchableOpacity
                      style={[
                        styles.headerBadgeButtons2,
                        {backgroundColor: '#98fb98'},
                      ]}
                      onPress={this.Save}>
                      <Text style={styles.textTagline}>Zapisz</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 4,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, marginHorizontal: 8}}>
                    <TouchableOpacity
                      style={[
                        styles.headerBadgeButtons2,
                        {backgroundColor: '#d3d3d3'},
                      ]}
                      onPress={() => this.setState({edit: false})}>
                      <Text style={styles.textTagline}>Anuluj</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 8,
                    marginVertical: 4,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, marginHorizontal: 8}}>
                    <TouchableOpacity
                      style={[styles.headerBadgeButtons2]}
                      onPress={() => this.props.navigation.goBack()}>
                      <Text style={styles.textTagline}>Wróć</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <RBSheet
              height={400}
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
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
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

                <Text style={styles.sheetHeaderTitle}>Godzina wizyty</Text>

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
                      <Text style={styles.radioLabel3}>{'Godzina Do:'}</Text>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        height={250}
                        ref={this.flatListHour}
                        data={this.state.hours}
                        getItemLayout={(data, index) => ({
                          length: 30,
                          offset: 30 * index,
                          index, // Indeks elementu
                        })}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => this.setState({hourValue: item})}
                            style={[
                              styles.radio,
                              hourValue == item
                                ? {
                                    marginVertical: 3,
                                    backgroundColor: '#d3e0fe',

                                    borderRadius: 5,
                                    marginHorizontal: 20,
                                  }
                                : {
                                    marginVertical: 3,
                                  },
                            ]}>
                            <Text
                              style={[
                                styles.radioLabel,
                                {marginLeft: 'auto', marginRight: 'auto'},
                              ]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        borderLeftWidth: 1,
                        borderColor: '#444444',
                      }}>
                      <Text style={styles.radioLabel3}>{'Godzina Do:'}</Text>
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        height={250}
                        getItemLayout={(data, index) => ({
                          length: 30,
                          offset: 30 * index,
                          index, // Indeks elementu
                        })}
                        ref={this.flatListHour2}
                        data={this.state.hours}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            onPress={() => this.setState({hourValue2: item})}
                            style={[
                              styles.radio,
                              hourValue2 == item
                                ? {
                                    marginVertical: 3,
                                    backgroundColor: '#d3e0fe',
                                    borderRadius: 5,
                                    marginHorizontal: 20,
                                  }
                                : {
                                    marginVertical: 3,
                                  },
                            ]}>
                            <Text
                              style={[
                                styles.radioLabel,
                                {marginLeft: 'auto', marginRight: 'auto'},
                              ]}>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </RBSheet>
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // format_day: state.calendar.format_day,
  // event_detail: state.calendar.event_detail,
  // isAuthenticated: state.auth.isAuthenticated,
  // user: state.auth.user,
  // members: state.member.members,
  // member_user: state.member.member_user,
  member_calendar: state.member.member_calendar,
  clients_events: state.calendar.clients_events,
  loading_client_events: state.calendar.loading_client_events,
  clients_detail: state.clients.clients_detail,
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
  deleateEvent,
})(Example);

const styles = StyleSheet.create({
  cardAvatarText: {
    fontSize: 40,
    fontWeight: '400',
    color: '#fff',
  },
  eventContainer: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 4,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  backdrop: {
    top: 0,
    left: 0,
    right: 0,
    // zIndex: 1,
    // height: 400,
    aspectRatio: 1 / 1,
  },
  leftClient: {
    aspectRatio: 1 / 1,
    // margin: 2,
    elevation: 5,
    // borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#9ca1ac',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
  rightClient: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    marginVertical: 1,
    borderColor: '#d6d6d6',
  },
  radio2: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
    justifyContent: 'flex-start',
    // paddingVertical: 1,
    paddingHorizontal: 0,
    marginVertical: 2,
  },
  form: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 7,
    backgroundColor: '#fff',
    // marginVertical: 24,
    marginHorizontal: 14,
    borderRadius: 20,
  },
  inputLabel: {
    width: 111,
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
  },
  bussy: {
    marginVertical: 20,
    color: '#ff1111',
    fontSize: 28,
    textAlign: 'center',
    // verticalAlign: 'bottom',
  },
  inputControl: {
    height: 40,
    backgroundColor: '#f3eff6',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },

  window: {
    backgroundColor: '#fff',
    height: '100%',
  },
  windowEvent: {
    padding: 4,

    width: width - 100,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsItemText: {
    marginLeft: 4,
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  backButton: {
    top: 20,
    left: 20,
  },
  windowLoading: {
    backgroundColor: 'black',
    height: '100%',
  },
  lessons: {
    backgroundColor: '#d3e0fe',
    borderTopLeftRadius: SECTION_BORDER_RADIUS,
    borderTopRightRadius: SECTION_BORDER_RADIUS,
    paddingVertical: 32,
    // paddingHorizontal: 24,
    flex: 1,
  },
  lessonsOverlay: {
    backgroundColor: '#fff',
  },
  rowContent: {
    alignItems: 'flex-start',
    // justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  guesstMovies: {
    marginVertical: 40,
  },
  backButton: {
    top: 20,
    left: 20,
  },
  descriptionContent: {
    // alignItems: 'center',
    // justifyContent: 'center',
    marginHorizontal: 24,
    marginTop: 4,
  },
  popularityText: {
    alignItems: 'center',

    fontSize: 12,
    color: 'black',
  },
  popularityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  textGuesst: {
    fontSize: 22,
    color: 'grey',
    textAlign: 'center',
  },
  textLoading: {
    fontSize: 50,
    color: 'grey',
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#185aca',
    textAlign: 'center',
  },
  textOverview: {
    fontSize: 16,
    color: '#185aca',
    textAlign: 'center',
  },
  textGenre: {
    fontSize: 20,
    textAlign: 'center',
    // alignContent: 'center',
    // alignItems: 'center',
    color: 'black',
    // textAlign: 'left',
  },
  appBarHorizontial: {
    marginHorizontal: 24,
    marginTop: 18,
  },
  textTagline: {
    textAlign: 'center',

    fontSize: 16,
    color: 'black',

    // marginVertical: 8,
    // marginHorizontal: 28,
    // marginTop: 12,
  },
  container: {
    display: 'flex',
    flex: 1,
  },
  container2: {
    marginVertical: 2,
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 7,
    marginTop: 2,
    // maxWidth: '100%',
    marginHorizontal: 14,
    paddingLeft: 4,
    paddingVertical: 5,
    // flex: 1,
    borderRadius: 20,

    borderTopLeftRadius: 99,
    borderBottomLeftRadius: 99,
    // height: 40,
  },
  image: {
    height: 222,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },

  imageBG: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    // backgroundColor: '#d3e0fe',
    aspectRatio: 60 / 17,
    // flexDirection: 'column-reverse',
    bottom: 0,
    // top: 0,
    // backgroundColor: 'red',
    // backgroundColor: 'red',
  },
  cardImage: {
    width: '40%',
    // height: 222,
    aspectRatio: 2 / 2,
    borderRadius: 999,
    position: 'absolute',
    // backgroundColor: 'blue',
    bottom: 0,
    alignSelf: 'center',
    // borderWidth: 8,
    // borderColor: '#212121',

    alignItems: 'center',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  containerGap32: {
    // margin,
    // gap: MARGIN_PADDING.mp_10,
    paddingHorizontal: 50,
  },
  headerBadge: {
    elevation: 5,
    backgroundColor: 'white',
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 10,
    // height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeButtons2: {
    flexDirection: 'row',
    backgroundColor: '#d3e0fe',
    width: '100%',
    paddingVertical: 10,
    // height: 46,
    elevation: 5,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title1: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    textAlign: 'center',
  },
  title2: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 0,
    textAlign: 'right',
  },
  title3: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
    textAlign: 'right',
  },
  title4: {
    fontSize: 18,
    fontWeight: '700',
    color: '#676767',
    marginBottom: 0,
    textAlign: 'right',
  },
  header: {
    // height: 50,
    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerAction: {
    flex: 1,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  descriptionContainer: {
    marginTop: 10,
  },
  radioLabel2: {
    // flex: 1,
    // paddingLeft: 0,
    fontWeight: '400',
    fontSize: 17,
    // fontWeight: '500',
    color: '#000',
    marginLeft: 12,
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
  done: {
    fontSize: 16,
    fontWeight: '600',
    color: '#236a23',
  },
  buttonContainerX3: {
    flex: 1,
    justifyContent: 'center', // Centrowanie w pionie
    alignItems: 'center',
    bottom: 20,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  container3: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    // marginVertical: 14,
    // marginVertical: 11,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderStyle: 'solid',
    borderRadius: 8,
    paddingVertical: 4,
  },
  counterAction: {
    width: 46,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterActionText: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '500',
    color: '#000',
  },
  counterValue: {
    minWidth: 34,
    fontSize: 17,
    fontWeight: '500',
    color: '#101010',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
