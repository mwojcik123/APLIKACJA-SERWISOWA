import React, {Component, createRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {getMembers, updateMembers, get_member_user} from '../actions/member';
import {loadGroup} from '../actions/group';
import {Logout} from '../actions/auth';
import {addWork} from '../actions/works';
import {getChatList} from '../actions/chat';
import {getCalendarDaily, getEvent, updateEvent} from '../actions/calendar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import WeriedTickDailyCalendar from '../common/weriedTickDailyCalendar';
import duval from '../assets/imgs/duval4.jpg';
const width = Dimensions.get('window').width;
const SECTION_TOP_OFFSET = 200;
const SECTION_BORDER_RADIUS = 40;

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.scrollY = new Animated.Value(0);
  }
  scrollViewRef = React.createRef();
  componentDidMount() {
    setTimeout(() => {
      if (this.scrollViewRef.current) {
        this.scrollViewRef.current.scrollTo({x: width, animated: false});
      }
    }, 0);
    this.props.getCalendarDaily();
    this.props.get_member_user();
    this.props.getMembers();
    this.props.loadGroup();
  }
  handleScroll = e => {
    // e.preventDefault();
    const offset = e.nativeEvent.contentOffset.x;
    const contentHeight = e.nativeEvent.contentSize.width;
    const scrollViewHeight = width;
    // console.log(offset);
    // console.log(contentHeight - width - 1);

    if (offset <= 0) {
      // console.log('ugibugi');

      // this.props.getPrevCalendar();

      this.scrollViewRef.current.scrollTo({x: width, animated: false});
    }
    if (offset >= contentHeight - scrollViewHeight - 1) {
      e.preventDefault();
      const wielkosc = this.props.days_format.length;
      // this.props.getNextCalendar();
      if (wielkosc >= 3) {
        this.scrollViewRef.current.scrollTo({x: width, animated: false});
      }
    }
  };

  render() {
    const {user, format_day, days_format} = this.props;

    if (!format_day || !format_day.day) {
      return null;
    }

    const day = new Date(format_day.day[0]);
    const events = format_day.events;
    const monthIndex = day.getMonth();
    const dayIndex = day.getDay();
    const dayInt = day.getDate();

    const animatedBackgroundScale = this.scrollY.interpolate({
      inputRange: [
        -SECTION_TOP_OFFSET - 100,
        -SECTION_TOP_OFFSET,
        0,
        SECTION_TOP_OFFSET,
        SECTION_TOP_OFFSET + 50,
        SECTION_TOP_OFFSET + 100,
      ],
      outputRange: [1.5, 1.25, 1.1, 1, 0, 0],
    });

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar backgroundColor="#d3e0fe" barStyle={'dark-content'} />
        <WeriedTickDailyCalendar />
        {/* lub {WeriedTickDailyCalendar()} */}

        <Animated.View
          style={{
            transform: [
              {scaleX: animatedBackgroundScale},
              {scaleY: animatedBackgroundScale},
            ],
          }}>
          <Image style={styles.backdrop} resizeMode="cover" source={duval} />
        </Animated.View>

        <ScrollView
          style={styles.container}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={1}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.lessonsTitle}>Witaj {user.username}!</Text>
              <View style={styles.statsItemButton}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.openDrawer()}
                  style={styles.headerBadge}>
                  <FeatherIcon name="more-vertical" color="#185aca" size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.subTitle}>{moment(day).format('dddd')}</Text>

            <View style={styles.stats}>
              <View style={styles.statsItem}>
                <FeatherIcon name="calendar" color="#2c2c2c" size={16} />
                <Text style={styles.day}>{moment(day).format('MMMM DD')}</Text>
              </View>
              <View style={styles.statsItem}>
                <FeatherIcon name="eye" color="#2c2c2c" size={16} />
                <Text style={styles.day}> {moment(day).format('MMMM DD')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.lessonsOverlay}>
            <View style={styles.lessons}>
              <Text style={styles.eventsTitle}>Wydarzenia</Text>
              {events.length > 0 &&
                events.map((eventItem, eventIndex) => (
                  <TouchableOpacity
                    key={eventIndex}
                    style={[
                      styles.card,
                      eventItem.bussy
                        ? eventItem.done
                          ? {backgroundColor: '#999999'}
                          : {backgroundColor: '#a4c2f5'}
                        : {backgroundColor: '#ffcccc'},
                    ]}
                    onPress={() => {
                      this.props.navigation.navigate('ShowEvent');
                      this.props.getEvent(eventItem.id);
                    }}>
                    <View style={styles.stats}>
                      {eventItem.bussy ? (
                        <View style={styles.statsItem}>
                          <FeatherIcon
                            name="clock"
                            color={eventItem.done ? '#444444' : '#185aca'}
                            size={24}
                          />
                          <Text
                            style={[
                              styles.statsItemText,
                              eventItem.done
                                ? {color: '#444444'}
                                : {color: '#185aca'},
                            ]}>
                            {eventItem.godzina_wizyty.substring(0, 2)}-
                            {eventItem.godzina_wizyty2.substring(0, 2)}
                          </Text>
                        </View>
                      ) : (
                        <Text style={{color: '#ff1111'}}>Hurra Wolne! :D</Text>
                      )}
                    </View>

                    <View>
                      {eventItem.client && (
                        <View style={styles.clientCard}>
                          <View style={styles.container2}>
                            <View
                              style={[
                                styles.leftClient,
                                eventItem.client.color
                                  ? {
                                      backgroundColor: eventItem.client.color,
                                    }
                                  : null,
                              ]}>
                              <Text style={styles.cardAvatarText}>
                                {eventItem.client.first_name[0]}
                              </Text>
                            </View>
                            <View>
                              <View style={styles.rightClient}>
                                <Text style={{color: 'black', fontSize: 17}}>
                                  {eventItem.client.first_name}{' '}
                                  {eventItem.client.second_name}
                                </Text>
                                <Text style={{color: '#333333'}}>
                                  <FeatherIcon
                                    name="map-pin"
                                    color="#333333"
                                    size={14}
                                  />{' '}
                                  {eventItem.client.town}{' '}
                                  {eventItem.client.street}{' '}
                                  {eventItem.client.nr_house}
                                </Text>
                                <Text style={{color: '#444444'}}>
                                  <FeatherIcon
                                    name="phone"
                                    color="#444444"
                                    size={14}
                                  />{' '}
                                  {eventItem.client.tel}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>

                    {(!eventItem.overview ||
                      !eventItem.rep ||
                      !eventItem.activation) && (
                      <Text
                        style={[
                          styles.desc,
                          eventItem.done
                            ? {color: '#444444'}
                            : {color: '#185aca'},
                        ]}>
                        {!eventItem.overview ? 'Przegląd ' : null}
                        {!eventItem.rep ? 'Naprawa ' : null}
                        {!eventItem.activation ? 'Uruchomienie ' : null}
                      </Text>
                    )}

                    {eventItem.description && (
                      <Text style={[styles.desc]}>
                        <FeatherIcon name="edit" color="#212121" size={14} />{' '}
                        {eventItem.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  format_day: state.calendar.format_day,
  user: state.auth.user,
  days_format: state.calendar.days_format,
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
  get_member_user,
  loadGroup,
})(CalendarScreen);
// [
//   {
//     date_joined: '2022-07-07',
//     group: {about: '123', id: 3, name: 'mateusz&karolina'},
//     id: 6,
//     permissions: 'NO',
//     person: {email: 'serwis.wojcik@gmail.com', id: 6, username: 'Edward'},
//   },
//   {
//     date_joined: '2022-07-07',
//     group: {about: '123', id: 3, name: 'mateusz&karolina'},
//     id: 7,
//     permissions: 'NO',
//     person: {email: 'info.dawid.malarz@gmail.com', id: 7, username: 'Dawid'},
//   },
//   {
//     date_joined: '2022-09-06',
//     group: {about: '123', id: 3, name: 'mateusz&karolina'},
//     id: 8,
//     permissions: 'NO',
//     person: {email: 'kamikarol@o2.pl', id: 59, username: 'Piotrek (k)'},
//   },
//   {
//     date_joined: '2022-09-06',
//     group: {about: '123', id: 3, name: 'mateusz&karolina'},
//     id: 9,
//     permissions: 'NO',
//     person: {email: 'Serwis2wojcik@gmail.com', id: 60, username: 'Maksio'},
//   },
//   {
//     date_joined: '2022-07-07',
//     group: {about: '123', id: 3, name: 'mateusz&karolina'},
//     id: 5,
//     permissions: 'SS',
//     person: {email: 'mateusz543212@gmail.com', id: 5, username: 'Mateusz'},
//   },
// ];

const styles = StyleSheet.create({
  cardAvatarText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#fff',
  },
  screen: {
    // width,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: 'red',
    // marginHorizontal: 1,
    // elevation: 3,
    // justifyContent: 'center',
    // alignItems: 'center',

    backgroundColor: '#fff',
    borderRadius: 40,
    width: width,
  },
  container2: {
    // borderBottomWidth: 1,

    // padding: 20,
    flexDirection: 'row',
    // backgroundColor: 'white',
    marginTop: 2,
    // maxWidth: '100%',
    marginLeft: 5,

    marginRight: 5,
    paddingLeft: 4,
    // flex: 1,
    borderRadius: 5,

    // height: 40,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    // height: 400,
    aspectRatio: 1 / 1,
  },
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  formClient: {
    // marginLeft
    marginVertical: 8,
    borderStyle: 'dashed',
    borderWidth: 4,
    borderColor: '#676767',
    padding: 20,
    // backgroundColor: '#ffffffdd',
    borderRadius: 16,
    // marginBottom: 16,
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#676767',
    marginBottom: 0,
    textAlign: 'center',
  },
  desc: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
    paddingHorizontal: 18,
  },
  content: {
    flex: 1,
    marginTop: SECTION_TOP_OFFSET,
    backgroundColor: '#d3e0fe',
    borderTopLeftRadius: SECTION_BORDER_RADIUS,
    borderTopRightRadius: SECTION_BORDER_RADIUS,
    paddingVertical: 24,
    paddingHorizontal: 18,
  },

  text: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#3c3c3c',
    lineHeight: 24,
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  headerBadge: {
    backgroundColor: 'white',
    elevation: 5,
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  /** Stats */
  stats: {
    // marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsItemText: {
    marginLeft: 4,
    fontSize: 20,
    fontWeight: '600',
    color: '#185aca',
  },
  /** Lessons */
  lessons: {
    backgroundColor: 'white',
    borderTopLeftRadius: SECTION_BORDER_RADIUS,
    borderTopRightRadius: SECTION_BORDER_RADIUS,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  lessonsOverlay: {
    backgroundColor: '#d3e0fe',
  },
  lessonsTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#185aca',
    // marginBottom: 12,
  },
  eventsTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c2c2c',
    // marginBottom: 12,
  },
  day: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c2c2c',
    // marginBottom: 12,
  },
  /** Card */
  card: {
    flex: 1,
    elevation: 3,
    marginVertical: 3,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#a4c2f5',
    borderRadius: 20,
    borderColor: '#d3e0fe',
    justifyContent: 'flex-start',
  },
  clientCard: {
    marginVertical: 1,
    // borderLeftWidth: 3,
    paddingHorizontal: 1,
    // borderTopLeftRadius: 2,
    // borderbottomLeftRadius: 2,
  },
  cardIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#185aca',
    marginHorizontal: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: 2,
  },
  cardDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
    // color: '#94b1f0',
  },
  cardAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a4c2f5',
  },
  rightClient: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    // borderLeftWidth: 1,
    marginVertical: 1,
    borderColor: '#d6d6d6',
  },
  leftClient: {
    aspectRatio: 1 / 1,
    // elevation: 5,
    // margin: 2,
    // borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#9ca1ac',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
  },
});
