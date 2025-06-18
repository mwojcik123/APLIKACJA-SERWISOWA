import React, {useRef, useState, Component, createRef} from 'react';
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
    this.sheetDeleate = createRef();
  }
  onChange = e => this.setState({[e.target.name]: e.target.value});

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
    const {clients_detail, clients_events} = this.props;
    const {edit, first_name, town, street, nr_house, tel} = this.state;

    return (
      <View style={styles.window}>
        {clients_detail ? null : (
          <ActivityIndicator
            size="large"
            color="#185aca"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
        <ScrollView
          style={styles.container}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={{backgroundColor: '#d3e0fe'}}>
            <View style={[styles.imageBG, {backgroundColor: '#d3e0fe'}]}>
              <View style={{height: '100%', width: '100%'}}>
                <TouchableOpacity
                  style={styles.headerBadge}
                  onPress={() => this.props.navigation.goBack()}>
                  <FeatherIcon name="chevron-left" size={26} color="#185aca" />
                </TouchableOpacity>
              </View>
            </View>

            {clients_detail ? (
              <View style={[styles.imageBG]}>
                <View
                  style={[
                    styles.cardImage,
                    {
                      backgroundColor: clients_detail.color,
                    },
                  ]}>
                  <Text style={styles.cardAvatarText}>
                    {clients_detail.first_name[0]}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          {clients_detail ? (
            <View style={{backgroundColor: '#fff', paddingBottom: 18}}>
              <>
                {!edit ? (
                  <>
                    {clients_detail ? (
                      <View style={styles.descriptionContent}>
                        <View>
                          <Text style={styles.textTitle}>
                            {clients_detail.first_name}
                          </Text>
                        </View>
                        <View style={styles.rowContent}>
                          <View style={styles.popularityContainer}></View>
                        </View>
                        <Text style={styles.textGenre}>
                          <FeatherIcon
                            name="map-pin"
                            size={20}
                            color={'black'}
                          />
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: 'black',
                              textAlign: 'center',
                            }}>
                            {clients_detail.town}{' '}
                          </Text>
                          <Text style={{fontWeight: '500'}}>
                            {clients_detail.street}{' '}
                          </Text>
                          {clients_detail.nr_house}
                        </Text>
                        <Text style={styles.textGenre}>
                          <FeatherIcon name="phone" size={20} color={'black'} />
                          <Text style={{fontWeight: 'bold'}}>
                            {clients_detail.tel}{' '}
                          </Text>
                        </Text>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <View style={styles.form}>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Imie i Nazwisko</Text>

                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={first_name =>
                          this.setState({first_name: first_name})
                        }
                        placeholder="Andrzej Nowak"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={first_name}
                      />
                    </View>

                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Miejscowość</Text>

                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={town => this.setState({town: town})}
                        placeholder="Warszawa"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={town}
                      />
                    </View>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Ulica</Text>

                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={street => this.setState({street: street})}
                        placeholder="Miczkiewicza"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={street}
                      />
                    </View>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Nr</Text>

                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={nr_house =>
                          this.setState({nr_house: nr_house})
                        }
                        placeholder="35"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={nr_house}
                      />
                    </View>
                    <View style={styles.input}>
                      <Text style={styles.inputLabel}>Tel</Text>

                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        onChangeText={tel => this.setState({tel: tel})}
                        placeholder="+48 123456789"
                        placeholderTextColor="#6b7280"
                        style={styles.inputControl}
                        value={tel}
                      />
                    </View>
                  </View>
                )}
              </>
            </View>
          ) : null}
          {clients_detail ? (
            <View style={styles.lessonsOverlay}>
              <View style={styles.lessons}>
                {!edit ? (
                  <>
                    {clients_events[0] ? (
                      <>
                        <Text style={styles.textTagline}>Ostatnie Wizyty:</Text>
                        <FlatList
                          snapToInterval={width - 100}
                          horizontal
                          data={clients_events.reverse()}
                          bounces={false}
                          contentContainerStyle={{paddingHorizontal: 50}}
                          keyExtractor={item => item.id.toString()}
                          renderItem={renderItem}
                        />
                      </>
                    ) : (
                      <Text style={styles.textTagline}>
                        Brak wcześniejszych wizyt.
                      </Text>
                    )}
                  </>
                ) : null}
                {!edit ? (
                  <>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 12,
                        marginVertical: 8,
                        marginTop: 24,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, marginHorizontal: 4}}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtons}
                          onPress={() => this.makeNAV(clients_detail)}>
                          <FeatherIcon name="map-pin" size={20} color="black" />
                          <Text style={styles.textTagline}> Nawiguj</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{flex: 1, marginHorizontal: 4}}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtons}
                          onPress={() => this.makeCall(clients_detail.tel)}>
                          <FeatherIcon name="phone" size={20} color="black" />
                          <Text style={styles.textTagline}> Telefon</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginHorizontal: 12,
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1, marginHorizontal: 4}}>
                        <TouchableOpacity
                          style={styles.headerBadgeButtons}
                          onPress={this.Edit}>
                          <FeatherIcon name="edit-3" size={20} color="black" />
                          <Text style={styles.textTagline}> Edytuj</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
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
                          style={[
                            styles.headerBadgeButtons,
                            {backgroundColor: '#ffcccc'},
                          ]}
                          onPress={() => this.sheetDeleate.current.open()}>
                          <Text style={styles.textTagline}>Usuń</Text>
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
                          style={[
                            styles.headerBadgeButtons,
                            {backgroundColor: '#98fb98'},
                          ]}
                          onPress={this.save}>
                          <Text style={styles.textTagline}>Zapisz</Text>
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
                          style={[
                            styles.headerBadgeButtons,
                            {backgroundColor: '#d3d3d3'},
                          ]}
                          onPress={() => this.setState({edit: false})}>
                          <Text style={styles.textTagline}>Anuluj</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 12,
                    marginVertical: 8,
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1, marginHorizontal: 4}}>
                    <TouchableOpacity
                      style={styles.headerBadgeButtons}
                      onPress={() => this.props.navigation.goBack()}>
                      <Text style={styles.textTagline}>Wróć</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
        <RBSheet
          customStyles={{container: styles.sheet3}}
          height={300}
          openDuration={250}
          ref={this.sheetDeleate}>
          <View style={styles.header3}>
            <Text style={styles.headerTitle3}>Uwaga!</Text>
          </View>

          <View style={styles.body3}>
            <Text style={styles.bodyText3}>
              Jesteś pewien że chcesz klienta?
            </Text>

            <TouchableOpacity onPress={this.Deleate}>
              <View style={styles.btn3}>
                <Text style={styles.btnText3}>Usuń</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bodyGap3} />

            <TouchableOpacity
              onPress={() => {
                this.sheetDeleate.current.close();
              }}>
              <View style={styles.btnSecondary3}>
                <Text style={styles.btnSecondaryText3}>Anuluj</Text>
              </View>
            </TouchableOpacity>
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
  update_client,
  delete_client,
})(Example);

const styles = StyleSheet.create({
  cardAvatarText: {
    fontSize: 100,
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

  radio2: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 1,
    paddingHorizontal: 0,
    marginVertical: 1,
  },
  form: {
    paddingHorizontal: 24,
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
    backgroundColor: '#d3e0fe',
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
    aspectRatio: 60 / 15,
    // flexDirection: 'column-reverse',
    // bottom: 0,
    // backgroundColor: 'red',
    // backgroundColor: 'red',
  },
  cardImage: {
    width: '40%',
    // height: 222,
    elevation: 8,
    aspectRatio: 2 / 2,
    borderRadius: 999,
    position: 'absolute',
    backgroundColor: 'blue',
    bottom: 2,
    alignSelf: 'center',
    // borderWidth: 8,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerGap32: {
    // margin,
    // gap: MARGIN_PADDING.mp_10,
    paddingHorizontal: 50,
  },
  headerBadge: {
    elevation: 5,
    top: 20,
    left: 20,
    backgroundColor: 'white',
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeButtons: {
    elevation: 5,
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 10,
    // height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet3: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  /** Placeholder */
  placeholder3: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  placeholderInset3: {
    borderWidth: 4,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Header */
  header3: {
    borderBottomWidth: 1,
    borderColor: '#efefef',
    padding: 16,
  },
  headerTitle3: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  /** Body */
  body3: {
    padding: 24,
  },
  bodyText3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#0e0e0e',
    marginBottom: 24,
    textAlign: 'center',
  },
  bodyGap3: {
    marginBottom: 12,
  },
  /** Button */
  btn3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#ff3c2f',
    borderColor: '#ff3c2f',
  },
  btnText3: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#dddce0',
  },
  btnSecondaryText3: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#000',
  },
});
