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
import {getCalendarDaily, getEvent, updateEvent} from '../actions/calendar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import clock from '../assets/images/clock.png';
import TickTime from '../common/TickTime';
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
      edit: false,
      first_name: '',
      town: '',
      street: '',
      nr_house: '',
      name: '',
      stove: null,
      tel: '',
      edit: false,
    };
    this.sheet = createRef();
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

  Edit = e => {
    this.setState({
      edit: !this.state.edit,
      first_name: this.props.clients_detail.first_name,
      town: this.props.clients_detail.town,
      street: this.props.clients_detail.street,
      nr_house: this.props.clients_detail.nr_house,
      tel: this.props.clients_detail.tel,
    });
    if (this.props.clients_detail.stove && this.state.edit == false) {
      this.setState({stove: this.props.clients_detail.stove.id});
    }
  };
  Deleate = () => {
    this.props.navigation.goBack();
    this.props.delete_client(this.props.clients_detail.id);
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
  save = e => {
    this.setState({edit: false});
    const {first_name, stove, town, street, nr_house, tel} = this.state;
    const body = JSON.stringify({
      first_name,
      stove,
      town,
      street,
      nr_house,
      tel,
    });
    this.setState({
      first_name: '',
      stove: null,
      town: '',
      street: '',
      nr_house: '',
      tel: '',
    });
    this.props.update_client(body, this.props.clients_detail.id);
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
    const {event_detail, clients_detail} = this.props;
    const {edit, first_name, town, street, nr_house, tel} = this.state;

    return (
      <View style={styles.window}>
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
                  <View style={[styles.headerAction, {alignItems: 'flex-end'}]}>
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
                                    godzina_wizyty={event_detail.godzina_wizyty}
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
          {event_detail.godzina_wizyty ? (
            <View style={{backgroundColor: '#fff', paddingBottom: 18}}>
              {event_detail.client ? (
                <Text style={styles.sectionTitle}>Klient</Text>
              ) : null}

              <>
                {event_detail.client ? (
                  <View
                    style={styles.container2}
                    // onPress={()=>this.props.navigation.navigate("Client")}
                  >
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
                        <FeatherIcon name="map-pin" color="#333333" size={14} />{' '}
                        {event_detail.client.town} {event_detail.client.street}{' '}
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
                <Text style={styles.sectionTitle}>OPIS</Text>
                <View
                  style={styles.form}
                  // key={index}
                >
                  {event_detail.bussy ? (
                    <>
                      <View style={styles.radio}>
                        <FeatherIcon color="#000" name={'eye'} size={20} />

                        <Text style={styles.radioLabel}>
                          {'Przegląd'}
                          {event_detail.overviewCount > 1
                            ? ' x' + event_detail.overviewCount
                            : null}
                        </Text>
                        {event_detail.overview ? (
                          <FeatherIcon color="#ff1111" name={'x'} size={20} />
                        ) : (
                          <FeatherIcon
                            color="#236a23"
                            name={'check'}
                            size={20}
                          />
                        )}
                      </View>

                      <View style={styles.radio}>
                        <FeatherIcon color="#000" name={'tool'} size={20} />

                        <Text style={styles.radioLabel}>{'Naprawa'}</Text>
                        {event_detail.rep ? (
                          <FeatherIcon color="#ff1111" name={'x'} size={20} />
                        ) : (
                          <FeatherIcon
                            color="#236a23"
                            name={'check'}
                            size={20}
                          />
                        )}
                      </View>

                      <View style={styles.radio}>
                        <FeatherIcon color="#000" name={'edit'} size={20} />

                        <Text style={styles.radioLabel}>{'Uruchomienie'}</Text>
                        {event_detail.activation ? (
                          <FeatherIcon color="#ff1111" name={'x'} size={20} />
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
                      <Text style={styles.radioLabel3}>{'Informacja:'}</Text>
                      <Text style={styles.radioLabel2}>
                        {event_detail.description}
                      </Text>
                    </View>
                  ) : null}
                </View>
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
                        <FeatherIcon name="tool" size={20} color="black" />
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
                          <Text style={styles.textTagline}> Zrobione</Text>
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
                          <Text style={styles.textTagline}> Nie zrobione</Text>
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
                    onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.textTagline}>Wróć</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.buttonContainerX3}>
              <ActivityIndicator size="large" color={'#185aca'} />
            </View>
          )}
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
  bussy: {
    marginVertical: 20,
    color: '#ff1111',
    fontSize: 28,
    textAlign: 'center',
    // verticalAlign: 'bottom',
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
    justifyContent: 'flex-start',
    paddingVertical: 1,
    paddingHorizontal: 0,
    height: 26,
    marginVertical: 1,
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

  inputControl: {
    height: 40,
    backgroundColor: '#f3eff6',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  radioLabel: {
    fontSize: 12,

    fontWeight: '500',
    color: '#000',
    marginLeft: 12,
    marginRight: 'auto',
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
    color: '#676767',
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
});
